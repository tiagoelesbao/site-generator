// Atualizar netlify/functions/publish-site.js
const { NetlifyAPI } = require('netlify');
const { createReadStream } = require('fs');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Verificar método
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido' }) };
  }
  
  // Processa o upload do arquivo
  const form = new formidable.IncomingForm();
  
  // Função para processar o form
  const parseForm = () => {
    return new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });
  };
  
  try {
    // Acessar o token do Netlify
    const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
    
    if (!NETLIFY_TOKEN) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Token de API do Netlify não configurado'
        })
      };
    }
    
    // Inicializar cliente Netlify
    const client = new NetlifyAPI(NETLIFY_TOKEN);
    
    // Processar o upload
    const { fields, files } = await parseForm();
    const siteName = fields.site_name || `site-${Date.now()}`;
    const zipFile = files.file;
    
    // Criar um novo site
    const site = await client.createSite({
      name: siteName
    });
    
    // Deploy do site
    const deploy = await client.deploySite({
      siteId: site.id,
      dir: path.dirname(zipFile.path),
      fnDir: null
    });
    
    // Limpar arquivo temporário
    fs.unlink(zipFile.path, () => {});
    
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
  } catch (error) {
    console.error('Erro na publicação:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Erro ao publicar site: ${error.message}`
      })
    };
  }
};