// src/utils/validators.js
export function validateDomain(domain) {
    if (!domain || typeof domain !== 'string') {
      return false;
    }
    
    // Remover espaços
    domain = domain.trim();
    
    // Regex para validar domínios
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
  }
  
  export function validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    // Regex para validar emails
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }
  
  export function validateCNPJ(cnpj) {
    if (!cnpj || typeof cnpj !== 'string') {
      return false;
    }
    
    // Remover caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verificar tamanho
    if (cnpj.length !== 14) {
      return false;
    }
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) {
      return false;
    }
    
    // Validar dígitos verificadores
    let sum = 0;
    let position = 5;
    
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * position;
      position = position === 2 ? 9 : position - 1;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    if (result !== parseInt(cnpj.charAt(12))) {
      return false;
    }
    
    sum = 0;
    position = 6;
    
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * position;
      position = position === 2 ? 9 : position - 1;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return result === parseInt(cnpj.charAt(13));
  }
  
  export function validateRequiredFields(formData, requiredFields) {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        missingFields.push(field);
      }
    }
    
    return missingFields;
  }
  
  export function validateFormData(formData) {
    const errors = {};
    
    // Validar campos obrigatórios
    const requiredFields = ['empresa', 'email', 'tituloHero'];
    const missingFields = validateRequiredFields(formData, requiredFields);
    
    if (missingFields.length > 0) {
      errors.missingFields = missingFields;
    }
    
    // Validar email
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    // Validar CNPJ se fornecido
    if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
      errors.cnpj = 'CNPJ inválido';
    }
    
    // Validar domínio se fornecido
    if (formData.dominio && !validateDomain(formData.dominio)) {
      errors.dominio = 'Domínio inválido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }