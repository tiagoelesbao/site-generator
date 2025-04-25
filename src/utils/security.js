// src/utils/security.js
import DOMPurify from 'dompurify';

// Sanitizar input geral (remover todas as tags HTML)
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remover todas as tags HTML
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  
  // Converter entidades HTML para seus equivalentes
  const textArea = document.createElement('textarea');
  textArea.innerHTML = clean;
  return textArea.value;
}

// Sanitizar HTML (permitir tags seguras)
export function sanitizeHTML(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Configuração para DOMPurify
  const config = {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'eval', 'javascript:', 'data:'],
    ADD_ATTR: ['rel', 'target'], // Adicionar rel="noopener" para links
    FORCE_BODY: true,
    SANITIZE_DOM: true
  };
  
  // Sanitizar HTML
  return DOMPurify.sanitize(input, config);
}

// Sanitizar URL
export function sanitizeURL(url) {
  if (typeof url !== 'string') {
    return '';
  }
  
  try {
    const urlObj = new URL(url);
    
    // Permitir apenas protocolos seguros
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }
    
    return urlObj.toString();
  } catch (error) {
    // URL inválida
    return '';
  }
}

// Validar e sanitizar domínio
export function sanitizeDomain(domain) {
  if (typeof domain !== 'string') {
    return '';
  }
  
  // Remover espaços em branco
  domain = domain.trim().toLowerCase();
  
  // Validar formato básico de domínio
  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
  
  if (!domainRegex.test(domain)) {
    return '';
  }
  
  return domain;
}