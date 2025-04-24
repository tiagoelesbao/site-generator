// src/utils/zohoAPI.js - Versão com integração Netlify

import { configureEmailDNS } from './netlifyAPI';

// Gerar senha segura aleatória
function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

/**
 * Simulação para MVP - Configuração de domínio e emails no Zoho
 * @param {string} domain - Domínio a ser configurado
 * @param {string} adminEmail - Email do administrador
 * @param {boolean} demoMode - Se verdadeiro, ignora validações e força sucesso
 * @returns {Promise} - Resultado simulado
 */
export async function simulateZohoSetup(domain, adminEmail, demoMode = false) {
  // Verificações básicas (ignoradas em modo de demonstração)
  if (!demoMode) {
    if (!domain || !domain.includes('.')) {
      return {
        success: false,
        error: 'Domínio inválido. Por favor, forneça um domínio válido.'
      };
    }
    
    if (!adminEmail || !adminEmail.includes('@')) {
      return {
        success: false,
        error: 'Email de administrador inválido.'
      };
    }
  }
  
  return new Promise((resolve) => {
    // Simular um delay de rede
    setTimeout(() => {
      const result = {
        success: true,
        domain: domain || 'exemplo.com.br', // Usar um domínio padrão em modo de demonstração
        domainId: 'dom_' + Math.random().toString(36).substring(2, 11),
        verificationRecords: [
          {
            type: 'TXT',
            name: domain || 'exemplo.com.br',
            value: 'zoho-verification=' + Math.random().toString(36).substring(2, 15)
          },
          {
            type: 'CNAME',
            name: 'zb' + Math.random().toString(36).substring(2, 7) + '.' + (domain || 'exemplo.com.br'),
            value: 'zmverify.zoho.com'
          }
        ],
        emailSetupRecords: [
          {
            type: 'MX',
            name: domain || 'exemplo.com.br',
            value: 'mx.zoho.com',
            priority: 10
          },
          {
            type: 'MX',
            name: domain || 'exemplo.com.br',
            value: 'mx2.zoho.com',
            priority: 20
          },
          {
            type: 'TXT',
            name: domain || 'exemplo.com.br',
            value: 'v=spf1 include:zoho.com ~all'
          }
        ],
        emailAccounts: [
          {
            address: `contato@${domain || 'exemplo.com.br'}`,
            accountId: 'acc_' + Math.random().toString(36).substring(2, 11),
            password: generateSecurePassword()
          },
          {
            address: `privacy@${domain || 'exemplo.com.br'}`,
            accountId: 'acc_' + Math.random().toString(36).substring(2, 11),
            password: generateSecurePassword()
          }
        ],
        loginUrl: 'https://mail.zoho.com',
        demoMode: demoMode
      };
      
      resolve(result);
    }, 1500);
  });
}

/**
 * Função para forçar simulação completa para teste/demonstração
 * @param {string} domain - Nome do domínio (opcional em modo demo)
 * @param {string} adminEmail - Email do administrador (opcional em modo demo)
 * @returns {Promise} - Resultado simulado para teste
 */
export async function forceZohoDemo(domain, adminEmail) {
  console.log('Executando simulação forçada para demonstração');
  return simulateZohoSetup(domain, adminEmail, true);
}

/**
 * Configura o Zoho Mail para um domínio e integra automaticamente com Netlify DNS
 * @param {string} domain - Domínio a ser configurado
 * @param {string} adminEmail - Email do administrador
 * @param {string} siteId - ID do site na Netlify
 * @param {boolean} isNetlifyDomain - Se o domínio foi registrado via Netlify
 * @returns {Promise} - Resultados da configuração com credenciais
 */
export async function setupZohoWithNetlify(domain, adminEmail, siteId, isNetlifyDomain = false) {
  try {
    // Para o MVP, usamos simulação
    const zohoSetupResult = await simulateZohoSetup(domain, adminEmail);
    
    // Para MVP, simulamos a verificação de domínio e criação de contas
    
    // Se o domínio foi registrado via Netlify, configura o DNS automaticamente
    if (isNetlifyDomain && zohoSetupResult.success) {
      // Preparar os registros DNS para email
      const emailDnsConfig = {
        mxRecords: zohoSetupResult.emailSetupRecords.filter(r => r.type === 'MX').map(r => ({
          value: r.value,
          priority: r.priority
        })),
        txtRecords: [
          ...zohoSetupResult.emailSetupRecords.filter(r => r.type === 'TXT').map(r => ({
            name: r.name,
            value: r.value
          })),
          ...zohoSetupResult.verificationRecords.filter(r => r.type === 'TXT').map(r => ({
            name: r.name,
            value: r.value
          }))
        ],
        cnameRecords: zohoSetupResult.verificationRecords.filter(r => r.type === 'CNAME').map(r => ({
          name: r.name,
          value: r.value
        }))
      };
      
      // Configurar o DNS automaticamente na Netlify
      try {
        const dnsResult = await configureEmailDNS(domain, emailDnsConfig);
        
        // Adicionar informação de configuração automática ao resultado
        zohoSetupResult.dnsConfigured = true;
        zohoSetupResult.dnsConfigurationResult = dnsResult;
        
        // Remover instruções de configuração manual já que foi automático
        zohoSetupResult.emailSetupInstructions = "DNS configurado automaticamente! Suas caixas de email estarão ativas em breve.";
      } catch (dnsError) {
        console.error('Erro ao configurar DNS automaticamente:', dnsError);
        zohoSetupResult.dnsConfigured = false;
        zohoSetupResult.dnsConfigurationError = dnsError.message;
        
        // Manter as instruções manuais como fallback
        zohoSetupResult.emailSetupInstructions = "Não foi possível configurar o DNS automaticamente. Use as instruções manuais abaixo.";
      }
    }
    
    return zohoSetupResult;
  } catch (error) {
    console.error('Erro ao configurar Zoho com Netlify:', error);
    throw new Error(`Falha na configuração de email: ${error.message}`);
  }
}

// Função placeholder para a futura implementação real
export async function getAccessToken() {
  console.log('Esta é uma função simulada para o MVP');
  return "SIMULATED_ACCESS_TOKEN";
}

// Função placeholder para a futura implementação real
export async function addDomainToZoho(domain, adminEmail) {
  console.log('Esta é uma função simulada para o MVP');
  return simulateZohoSetup(domain, adminEmail);
}

// Função placeholder para a futura implementação real
export async function createEmailAccounts(domain, domainId) {
  console.log('Esta é uma função simulada para o MVP');
  const simResult = await simulateZohoSetup(domain, "admin@example.com");
  return {
    success: true,
    emailAccounts: simResult.emailAccounts
  };
}

export default {
  simulateZohoSetup,
  getAccessToken,
  addDomainToZoho,
  createEmailAccounts,
  forceZohoDemo,
  setupZohoWithNetlify
};