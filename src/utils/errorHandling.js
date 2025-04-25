// src/utils/errorHandling.js
// Tipos de erros personalizados
export class APIError extends Error {
    constructor(message, status, details = {}) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.details = details;
    }
  }
  
  export class ValidationError extends Error {
    constructor(message, field = null) {
      super(message);
      this.name = 'ValidationError';
      this.field = field;
    }
  }
  
  export class NetworkError extends Error {
    constructor(message, retryable = true) {
      super(message);
      this.name = 'NetworkError';
      this.retryable = retryable;
    }
  }
  
  export class AuthError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AuthError';
    }
  }
  
  // Mapear códigos HTTP para mensagens amigáveis
  const HTTP_ERROR_MESSAGES = {
    400: 'Requisição inválida. Verifique os dados enviados.',
    401: 'Autenticação necessária. Verifique suas credenciais.',
    403: 'Acesso negado. Você não tem permissão para acessar este recurso.',
    404: 'Recurso não encontrado.',
    429: 'Muitas requisições. Tente novamente mais tarde.',
    500: 'Erro interno do servidor. Por favor, tente novamente mais tarde.',
    502: 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.',
    503: 'Serviço temporariamente sobrecarregado. Tente novamente em alguns minutos.',
    504: 'Tempo limite excedido. Tente novamente mais tarde.'
  };
  
  // Função para criar uma mensagem de erro amigável baseada no código HTTP
  export function getFriendlyErrorMessage(error) {
    if (error instanceof ValidationError) {
      return `Erro de validação: ${error.message}`;
    }
    
    if (error instanceof APIError) {
      const defaultMessage = HTTP_ERROR_MESSAGES[error.status] || 'Erro na comunicação com o servidor.';
      return `${defaultMessage} ${error.message}`;
    }
    
    if (error instanceof NetworkError) {
      return `Erro de conexão: ${error.message}. ${error.retryable ? 'Tentando novamente...' : 'Por favor, verifique sua conexão.'}`;
    }
    
    if (error instanceof AuthError) {
      return `Erro de autenticação: ${error.message}. Por favor, faça login novamente.`;
    }
    
    // Erros genéricos
    return error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
  }
  
  // Sistema de retentativas
  export async function withRetry(fn, options = {}) {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      factor = 2,
      retryCondition = (error) => error instanceof NetworkError && error.retryable
    } = options;
    
    let lastError;
    let delay = initialDelay;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Verifica se deve tentar novamente
        if (attempt >= maxRetries || !retryCondition(error)) {
          throw error;
        }
        
        // Calcula delay com jitter para evitar thundering herd
        const jitter = Math.random() * 0.3 + 0.85; // 0.85-1.15
        delay = Math.min(delay * factor * jitter, maxDelay);
        
        // Aguarda antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }