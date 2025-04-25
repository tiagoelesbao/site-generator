// src/constants/publishingPlans.js
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
      ],
      icon: 'cloud_upload'
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
      ],
      icon: 'language'
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
      ],
      icon: 'verified'
    }
  };