// netlify/functions/deploy-site.js
const { NetlifyAPI } = require('netlify');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Converter callbacks em promises
const unlinkAsync = util.promisify(fs.unlink);

exports.handler = async (event, context) => {
  // Verificar método
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' }) 
    };
  }
  
  // Verificar content-type
  const contentType = event.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Content-Type inválido. Use multipart/form-data.' })
    };
  }

  try {
    // Obter token Netlify (ambiente ou request)
    const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN || 
                         process.env.REACT_APP_NETLIFY_TOKEN;
    
    if (!NETLIFY_TOKEN) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Token de autenticação Netlify não encontrado.',
          dev_info: 'Configure a variável de ambiente NETLIFY_TOKEN.'
        })
      };
    }

    // Inicializar cliente Netlify
    const netlifyClient = new NetlifyAPI(NETLIFY_TOKEN);
    
    // Processar o formulário
    const form = new formidable.IncomingForm({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      keepExtensions: true
    });
    
    // Obter campos e arquivos do request
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    
    // Verificar campos necessários
    const siteName = fields.site_name || `site-${Date.now()}`;
    const zipFile = files.file;
    
    if (!zipFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Arquivo ZIP não fornecido',
          dev_info: 'Envie um arquivo no campo "file" do FormData'
        })
      };
    }
    
    console.log(`Iniciando publicação do site: ${siteName}`);
    
    // 1. Criar novo site na Netlify
    const site = await netlifyClient.createSite({
      name: siteName,
      account_slug: process.env.NETLIFY_ACCOUNT_SLUG || undefined
    });
    
    console.log(`Site criado com ID: ${site.id}, URL: ${site.ssl_url || site.url}`);

    // 2. Realizar deploy do site
    const zipFilePath = zipFile.filepath;
    const deployDir = path.dirname(zipFilePath);
    
    console.log(`Realizando deploy do arquivo: ${zipFilePath}`);
    
    const deploy = await netlifyClient.deploySite({
      siteId: site.id,
      dir: deployDir,
      fnDir: null,
      functions: null,
      zip: zipFilePath,  // Usar o arquivo ZIP diretamente
      message: "Deploy inicial via SiteGenAI"
    });
    
    console.log(`Deploy realizado com sucesso. ID: ${deploy.id}`);
    
    // 3. Limpar arquivo temporário
    await unlinkAsync(zipFilePath);
    
    // 4. Retornar resultado
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        site: {
          id: site.id,
          name: site.name,
          url: site.ssl_url || site.url,
          admin_url: site.admin_url,
          deploy_id: deploy.id,
          deploy_url: deploy.deploy_ssl_url || deploy.deploy_url
        },
        message: "Site publicado com sucesso!"
      })
    };
  } catch (error) {
    console.error('Erro na publicação:', error);
    
    // Categorizar erro para mensagem mais útil
    let errorMessage = error.message;
    let statusCode = 500;
    
    if (error.message.includes('unauthorized') || error.message.includes('token')) {
      errorMessage = 'Erro de autenticação com a Netlify. Verifique seu token.';
      statusCode = 401;
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      errorMessage = 'Erro de rede ou timeout. Tente novamente em alguns instantes.';
      statusCode = 503;
    } else if (error.message.includes('maxFileSize')) {
      errorMessage = 'O arquivo ZIP excede o tamanho máximo permitido (50MB).';
      statusCode = 413;
    }
    
    return {
      statusCode: statusCode,
      body: JSON.stringify({
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
        step: error.step || 'unknown'
      })
    };
  }
};