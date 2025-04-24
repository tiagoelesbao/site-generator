// src/utils/netlifyAPI.js - Versão com suporte a serverless e compatibilidade

import axios from 'axios';

const NETLIFY_API_BASE_URL = 'https://api.netlify.com/api/v1';
const NETLIFY_TOKEN = process.env.REACT_APP_NETLIFY_TOKEN;

// Verificar se o token está definido
if (!NETLIFY_TOKEN) {
  console.error('Atenção: REACT_APP_NETLIFY_TOKEN não está definido!');
  // Em ambiente de desenvolvimento, use um token de simulação
  if (process.env.NODE_ENV === 'development') {
    console.warn('Usando token de simulação para ambiente de desenvolvimento');
  }
}

// Configuração base para as requisições Netlify
const netlifyApi = axios.create({
  baseURL: NETLIFY_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${NETLIFY_TOKEN || 'development-token'}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Função simplificada para publicar site no Netlify via serverless function
 * @param {Blob} zipBlob - Arquivo ZIP do site
 * @param {Object} siteInfo - Informações do site
 * @returns {Promise<Object>} - Informações do site publicado
 */
export async function publishToNetlify(zipBlob, siteInfo) {
  try {
    // Convertendo o Blob para FormData
    const formData = new FormData();
    formData.append('file', zipBlob, 'site.zip');
    formData.append('site_name', siteInfo.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'));
    
    // Chamada para a função Netlify
    const response = await axios.post('/.netlify/functions/publish-site', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao publicar site:', error);
    
    // Verificar se é um erro de autenticação
    if (error.response && error.response.status === 401) {
      throw new Error('Falha na autenticação com o Netlify. Verifique seu token de API.');
    }
    
    throw new Error(`Falha ao publicar site: ${error.message}`);
  }
}

/**
 * Função legada para deploy de site diretamente na API Netlify
 * @deprecated Use publishToNetlify em vez desta função
 * @param {Blob} zipFile - Arquivo ZIP do site
 * @param {string} siteName - Nome do site para usar na URL
 * @returns {Promise} - Resultado da operação com URL e ID do site
 */
export async function deploySite(zipFile, siteName) {
  // Em ambiente de desenvolvimento, simular deploy para facilitar testes
  if (process.env.NODE_ENV === 'development' && !NETLIFY_TOKEN) {
    console.log('Modo de desenvolvimento: utilizando função serverless para deploy');
    return publishToNetlify(zipFile, { name: siteName });
  }
  
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
        'Authorization': `Bearer ${NETLIFY_TOKEN || 'development-token'}`,
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
 * Registra um novo domínio através do Netlify e configura DNS automaticamente
 * @param {string} siteId - ID do site no Netlify
 * @param {string} domainName - Nome do domínio a ser registrado
 * @param {object} emailConfig - Configurações de email para configurar DNS automaticamente
 * @returns {Promise} - Resultado da operação com status do registro
 */
export async function registerDomain(siteId, domainName, emailConfig = null) {
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
    
    // 4. Aguardar pela confirmação do registro (pode levar algum tempo)
    // Em uma implementação real, isso seria feito com um webhook ou verificação periódica
    
    // 5. Se temos configurações de email, adicionamos os registros DNS automaticamente
    if (emailConfig && registerResponse.data.state === 'done') {
      await configureEmailDNS(domainName, emailConfig);
    }
    
    return {
      domain: domainName,
      status: registerResponse.data.state,
      registration_id: registerResponse.data.id,
      dnsConfigured: emailConfig ? true : false
    };
  } catch (error) {
    console.error('Erro ao registrar domínio:', error);
    throw new Error(`Falha ao registrar domínio: ${error.message}`);
  }
}

/**
 * Configura registros DNS para serviços de email no domínio
 * @param {string} domainName - Nome do domínio
 * @param {object} emailConfig - Configurações de email (MX, TXT, CNAME)
 * @returns {Promise} - Resultado da operação
 */
export async function configureEmailDNS(domainName, emailConfig) {
  try {
    const dnsRecords = [];
    
    // Adicionar registros MX para email
    if (emailConfig.mxRecords && emailConfig.mxRecords.length > 0) {
      for (const record of emailConfig.mxRecords) {
        dnsRecords.push({
          type: 'MX',
          hostname: domainName,
          value: record.value,
          ttl: 3600,
          priority: record.priority || 10
        });
      }
    }
    
    // Adicionar registros TXT para SPF, DKIM, etc.
    if (emailConfig.txtRecords && emailConfig.txtRecords.length > 0) {
      for (const record of emailConfig.txtRecords) {
        dnsRecords.push({
          type: 'TXT',
          hostname: record.name || domainName,
          value: record.value,
          ttl: 3600
        });
      }
    }
    
    // Adicionar registros CNAME para verificação
    if (emailConfig.cnameRecords && emailConfig.cnameRecords.length > 0) {
      for (const record of emailConfig.cnameRecords) {
        dnsRecords.push({
          type: 'CNAME',
          hostname: record.name,
          value: record.value,
          ttl: 3600
        });
      }
    }
    
    // Adicionar todos os registros DNS de uma vez
    if (dnsRecords.length > 0) {
      const dnsResponse = await netlifyApi.post(`/dns_zones/${domainName}/dns_records`, {
        records: dnsRecords
      });
      
      return {
        success: true,
        records: dnsResponse.data,
        message: `Configurados ${dnsRecords.length} registros DNS para email`
      };
    }
    
    return {
      success: false,
      message: 'Nenhum registro DNS para configurar'
    };
  } catch (error) {
    console.error('Erro ao configurar DNS para email:', error);
    throw new Error(`Falha ao configurar DNS: ${error.message}`);
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
  publishToNetlify,  // Adicionando a nova função ao export padrão
  deploySite,
  registerDomain,
  configureEmailDNS,
  checkSiteStatus
};