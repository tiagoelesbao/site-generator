// Arquivo: src/utils/netlifyAPI.js

import axios from 'axios';

const NETLIFY_API_BASE_URL = 'https://api.netlify.com/api/v1';
const NETLIFY_TOKEN = process.env.REACT_APP_NETLIFY_TOKEN;

// Configuração base para as requisições Netlify
const netlifyApi = axios.create({
  baseURL: NETLIFY_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${NETLIFY_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Faz deploy de um site no Netlify
 * @param {Blob} zipFile - Arquivo ZIP do site
 * @param {string} siteName - Nome do site para usar na URL
 * @returns {Promise} - Resultado da operação com URL e ID do site
 */
export async function deploySite(zipFile, siteName) {
  try {
    // Normalizar o nome do site (remover espaços, caracteres especiais, etc.)
    const normalizedSiteName = siteName
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    // 1. Criar um novo site
    const siteResponse = await netlifyApi.post('/sites', {
      name: normalizedSiteName,
      custom_domain: null // Inicialmente sem domínio personalizado
    });
    
    const siteId = siteResponse.data.id;
    const siteUrl = siteResponse.data.url; // URL padrão do Netlify (nomedosite.netlify.app)
    
    // 2. Fazer upload e deploy do arquivo ZIP
    const formData = new FormData();
    formData.append('file', zipFile, 'site.zip');
    
    const deployUrl = `${NETLIFY_API_BASE_URL}/sites/${siteId}/deploys`;
    const deployResponse = await axios.post(deployUrl, formData, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 3. Retornar os detalhes do site publicado
    return {
      siteId: siteId,
      deployId: deployResponse.data.id,
      siteUrl: siteUrl,
      netlifyUrl: `https://${normalizedSiteName}.netlify.app`,
      status: 'success'
    };
  } catch (error) {
    console.error('Erro ao fazer deploy no Netlify:', error);
    throw new Error(`Falha ao publicar site: ${error.message}`);
  }
}

/**
 * Configura um domínio personalizado para o site
 * @param {string} siteId - ID do site no Netlify
 * @param {string} domainName - Nome do domínio a ser configurado
 * @returns {Promise} - Resultado da operação com instruções DNS
 */
export async function setupCustomDomain(siteId, domainName) {
  try {
    // 1. Verificar disponibilidade do domínio
    const domainCheckResponse = await netlifyApi.post(`/domains/${domainName}/dns_check`);
    
    if (!domainCheckResponse.data.available) {
      throw new Error('Domínio não está disponível para registro');
    }
    
    // 2. Adicionar domínio personalizado ao site
    const domainResponse = await netlifyApi.post(`/sites/${siteId}/domains`, {
      hostname: domainName
    });
    
    // 3. Obter instruções DNS para configuração
    const dnsResponse = await netlifyApi.get(`/sites/${siteId}/dns`);
    
    return {
      domain: domainName,
      status: 'pending_dns_setup',
      dns_records: dnsResponse.data,
      domain_id: domainResponse.data.id
    };
  } catch (error) {
    console.error('Erro ao configurar domínio personalizado:', error);
    throw new Error(`Falha ao configurar domínio: ${error.message}`);
  }
}

/**
 * Registra um novo domínio através do Netlify
 * @param {string} siteId - ID do site no Netlify
 * @param {string} domainName - Nome do domínio a ser registrado
 * @returns {Promise} - Resultado da operação com status do registro
 */
export async function registerDomain(siteId, domainName) {
  try {
    // 1. Verificar disponibilidade do domínio
    const domainCheckResponse = await netlifyApi.post(`/domains/${domainName}/registry/check`);
    
    if (!domainCheckResponse.data.available) {
      throw new Error('Domínio não está disponível para registro');
    }
    
    // 2. Registrar o domínio
    const registerResponse = await netlifyApi.post(`/domains/${domainName}/registry`, {
      site_id: siteId
    });
    
    // 3. Configurar o domínio para o site
    await netlifyApi.post(`/sites/${siteId}/domains`, {
      hostname: domainName
    });
    
    return {
      domain: domainName,
      status: registerResponse.data.state,
      registration_id: registerResponse.data.id
    };
  } catch (error) {
    console.error('Erro ao registrar domínio:', error);
    throw new Error(`Falha ao registrar domínio: ${error.message}`);
  }
}

/**
 * Verifica o status de publicação de um site
 * @param {string} siteId - ID do site no Netlify
 * @returns {Promise} - Status atual do site e informações de deploy
 */
export async function checkSiteStatus(siteId) {
  try {
    const response = await netlifyApi.get(`/sites/${siteId}`);
    
    return {
      siteId: siteId,
      status: response.data.state,
      url: response.data.url,
      custom_domain: response.data.custom_domain,
      published_at: response.data.published_at
    };
  } catch (error) {
    console.error('Erro ao verificar status do site:', error);
    throw new Error(`Falha ao verificar status: ${error.message}`);
  }
}

export default {
  deploySite,
  setupCustomDomain,
  registerDomain,
  checkSiteStatus
};