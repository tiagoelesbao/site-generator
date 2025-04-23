// Arquivo: src/utils/stripeAPI.js

import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Carregar Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Definir os planos de publicação
export const PUBLISHING_PLANS = {
  BASIC: {
    id: 'basic_publishing',
    name: 'Publicação Básica',
    description: 'Publicação do site com subdomínio gratuito',
    price: 0,
    features: [
      'Hospedagem na Netlify',
      'Subdomínio gratuito (seusite.netlify.app)',
      'HTTPS incluído',
      'Sem limite de tráfego'
    ]
  },
  CUSTOM_DOMAIN: {
    id: 'custom_domain',
    name: 'Domínio Personalizado',
    description: 'Publicação com seu domínio personalizado',
    price: 1500, // R$ 15,00 em centavos
    features: [
      'Todos os recursos do plano básico',
      'Uso de domínio próprio',
      'Configuração automática de DNS',
      'Certificado SSL gratuito'
    ]
  },
  DOMAIN_REGISTRATION: {
    id: 'domain_registration',
    name: 'Registro de Domínio',
    description: 'Registre um novo domínio e publique seu site',
    price: 4500, // R$ 45,00 em centavos
    features: [
      'Todos os recursos do plano com domínio personalizado',
      'Registro de domínio .com.br por 1 ano',
      'Renovação automática opcional',
      'Painel de gerenciamento do domínio'
    ]
  }
};

/**
 * Cria uma sessão de checkout para o plano selecionado
 * @param {string} planId - ID do plano de publicação
 * @param {string} siteName - Nome do site para referência
 * @param {object} siteDetails - Detalhes adicionais para metadados
 * @returns {Promise} - URL de checkout
 */
export async function createCheckoutSession(planId, siteName, siteDetails = {}) {
  try {
    const plan = PUBLISHING_PLANS[planId];
    
    if (!plan) {
      throw new Error('Plano de publicação inválido');
    }
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: planId,
        siteName: siteName,
        price: plan.price,
        metadata: {
          ...siteDetails,
          plan_name: plan.name
        }
      }),
    });
    
    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }
    
    return session;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw new Error(`Falha ao processar pagamento: ${error.message}`);
  }
}

export default {
  stripePromise,
  PUBLISHING_PLANS,
  createCheckoutSession
};