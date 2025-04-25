// src/utils/logger.js
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };
  
  class Logger {
    constructor(options = {}) {
      this.minLevel = options.minLevel || LOG_LEVELS.DEBUG;
      this.enableConsole = options.enableConsole !== false;
      this.maxLogSize = options.maxLogSize || 500;
      this.storage = options.storage || localStorage;
      this.remoteLogging = options.remoteLogging || false;
      this.remoteEndpoint = options.remoteEndpoint || null;
      
      this.logs = this._loadLogs();
    }
    
    // Carregar logs do storage
    _loadLogs() {
      try {
        const storedLogs = this.storage.getItem('app_logs');
        return storedLogs ? JSON.parse(storedLogs) : [];
      } catch (error) {
        console.error('Erro ao carregar logs:', error);
        return [];
      }
    }
    
    // Salvar logs no storage
    _saveLogs() {
      try {
        // Limitar o número de logs
        if (this.logs.length > this.maxLogSize) {
          this.logs = this.logs.slice(-this.maxLogSize);
        }
        
        this.storage.setItem('app_logs', JSON.stringify(this.logs));
      } catch (error) {
        console.error('Erro ao salvar logs:', error);
      }
    }
    
    // Registrar log
    _log(level, message, data = null) {
      if (level < this.minLevel) {
        return;
      }
      
      const timestamp = new Date().toISOString();
      const levelName = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level);
      
      // Criar objeto de log
      const logEntry = {
        timestamp,
        level: levelName,
        message,
        data: data ? JSON.parse(JSON.stringify(data)) : null
      };
      
      // Adicionar ao array
      this.logs.push(logEntry);
      
      // Salvar logs
      this._saveLogs();
      
      // Exibir no console
      if (this.enableConsole) {
        const consoleMethod = {
          DEBUG: 'debug',
          INFO: 'info',
          WARN: 'warn',
          ERROR: 'error'
        }[levelName];
        
        if (data) {
          console[consoleMethod](`[${timestamp}] ${levelName}: ${message}`, data);
        } else {
          console[consoleMethod](`[${timestamp}] ${levelName}: ${message}`);
        }
      }
      
      // Enviar para endpoint remoto se habilitado
      if (this.remoteLogging && this.remoteEndpoint && level >= LOG_LEVELS.ERROR) {
        this._sendRemoteLog(logEntry);
      }
      
      return logEntry;
    }
    
    // Enviar log para endpoint remoto
    async _sendRemoteLog(logEntry) {
      try {
        // Enviar log para endpoint remoto
        await fetch(this.remoteEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(logEntry),
          // Não esperar resposta para não bloquear
          keepalive: true
        });
      } catch (error) {
        // Não logar erro para evitar loop infinito
        console.error('Erro ao enviar log remoto:', error);
      }
    }
    
    // Métodos públicos
    debug(message, data) {
      return this._log(LOG_LEVELS.DEBUG, message, data);
    }
    
    info(message, data) {
      return this._log(LOG_LEVELS.INFO, message, data);
    }
    
    warn(message, data) {
      return this._log(LOG_LEVELS.WARN, message, data);
    }
    
    error(message, data) {
      return this._log(LOG_LEVELS.ERROR, message, data);
    }
    
    // Obter todos os logs
    getLogs() {
      return [...this.logs];
    }
    
    // Limpar logs
    clearLogs() {
      this.logs = [];
      this._saveLogs();
    }
    
    // Exportar logs
    exportLogs() {
      return JSON.stringify(this.logs, null, 2);
    }
  }
  
  // Exportar instância única
  const logger = new Logger({
    minLevel: process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG,
    remoteLogging: process.env.NODE_ENV === 'production',
    remoteEndpoint: process.env.REACT_APP_LOG_ENDPOINT
  });
  
  export default logger;