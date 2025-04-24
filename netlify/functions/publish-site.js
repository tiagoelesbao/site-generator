// netlify/functions/publish-site.js
const { NetlifyAPI } = require('netlify');
const formidable = require('formidable');
const util = require('util');
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Verificar método
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Método não permitido' }) 
    };
  }
  
  try {
    // Acessar o token do Netlify de várias fontes possíveis
    let NETLIFY_TOKEN = process.env.NETLIFY_TOKEN || 
                        process.env.REACT_APP_NETLIFY_TOKEN ||
                        null;
    
    // Verificar se um token foi enviado no formData
    const contentType = event.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      const form = new formidable.IncomingForm();
      
      // Processar o formulário
      const formData = await new Promise((resolve, reject) => {
        form.parse(event, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });
      
      // Verificar se um token foi enviado no formData
      if (formData.fields.netlify_token && !NETLIFY_TOKEN) {
        NETLIFY_TOKEN = formData.fields.netlify_token;
      }
      
      // Verificar se temos um token válido
      if (!NETLIFY_TOKEN) {
        return {
          statusCode: 401,
          body: JSON.stringify({
            error: 'Token de API do Netlify não encontrado. Configure NETLIFY_TOKEN nas variáveis de ambiente do site ou envie no formData.'
          })
        };
      }
      
      // Inicializar cliente Netlify
      const client = new NetlifyAPI(NETLIFY_TOKEN);
      
      // Obter informações do site a ser criado
      const siteName = formData.fields.site_name || `site-${Date.now()}`;
      const zipFile = formData.files.file;
      
      if (!zipFile) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Arquivo ZIP não fornecido'
          })
        };
      }
      
      // Criar um novo site
      const site = await client.createSite({
        name: siteName
      });
      
      // Deploy do site
      const deploy = await client.deploySite({
        siteId: site.id,
        dir: path.dirname(zipFile.filepath),
        fnDir: null
      });
      
      // Limpar arquivo temporário
      await util.promisify(fs.unlink)(zipFile.filepath);
      
      // Retornar informações do site publicado
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          site: {
            id: site.id,
            name: site.name,
            url: site.ssl_url || site.url,
            deploy_id: deploy.id,
            deploy_url: deploy.deploy_ssl_url || deploy.deploy_url
          }
        })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Content-Type inválido. Use multipart/form-data.'
        })
      };
    }
  } catch (error) {
    console.error('Erro na publicação:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Erro ao publicar site: ${error.message}`,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};