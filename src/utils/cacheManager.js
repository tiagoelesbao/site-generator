// src/utils/cacheManager.js
class CacheManager {
    constructor(options = {}) {
      this.storage = options.storage || localStorage;
      this.prefix = options.prefix || 'app_cache_';
      this.defaultTTL = options.defaultTTL || 3600; // 1 hora em segundos
    }
    
    // Gerar chave para o cache
    _getCacheKey(key) {
      return `${this.prefix}${key}`;
    }
    
    // Verificar se o item do cache é válido
    _isValidCacheItem(item) {
      if (!item) return false;
      
      try {
        const parsed = JSON.parse(item);
        return parsed.expiry > Date.now();
      } catch (error) {
        return false;
      }
    }
    
    // Salvar item no cache
    set(key, value, ttl = this.defaultTTL) {
      try {
        const cacheKey = this._getCacheKey(key);
        const item = {
          value,
          expiry: Date.now() + (ttl * 1000),
          createdAt: Date.now()
        };
        
        this.storage.setItem(cacheKey, JSON.stringify(item));
        return true;
      } catch (error) {
        console.error(`Erro ao salvar item no cache: ${key}`, error);
        return false;
      }
    }
    
    // Obter item do cache
    get(key) {
      try {
        const cacheKey = this._getCacheKey(key);
        const item = this.storage.getItem(cacheKey);
        
        if (!this._isValidCacheItem(item)) {
          this.remove(key);
          return null;
        }
        
        return JSON.parse(item).value;
      } catch (error) {
        console.error(`Erro ao obter item do cache: ${key}`, error);
        return null;
      }
    }
    
    // Remover item do cache
    remove(key) {
      try {
        const cacheKey = this._getCacheKey(key);
        this.storage.removeItem(cacheKey);
        return true;
      } catch (error) {
        console.error(`Erro ao remover item do cache: ${key}`, error);
        return false;
      }
    }
    
    // Limpar todo o cache
    clear() {
      try {
        // Listar todas as chaves
        const keys = [];
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key.startsWith(this.prefix)) {
            keys.push(key);
          }
        }
        
        // Remover itens
        keys.forEach(key => this.storage.removeItem(key));
        return true;
      } catch (error) {
        console.error('Erro ao limpar cache', error);
        return false;
      }
    }
    
    // Limpar itens expirados
    clearExpired() {
      try {
        // Listar todas as chaves
        const keys = [];
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key.startsWith(this.prefix)) {
            keys.push(key);
          }
        }
        
        // Verificar e remover itens expirados
        keys.forEach(cacheKey => {
          const item = this.storage.getItem(cacheKey);
          if (!this._isValidCacheItem(item)) {
            this.storage.removeItem(cacheKey);
          }
        });
        
        return true;
      } catch (error) {
        console.error('Erro ao limpar itens expirados', error);
        return false;
      }
    }
    
    // Wrapper para executar função com cache
    async withCache(key, fn, ttl = this.defaultTTL) {
      // Verificar cache
      const cachedValue = this.get(key);
      if (cachedValue !== null) {
        return cachedValue;
      }
      
      // Executar função
      const result = await fn();
      
      // Salvar no cache
      this.set(key, result, ttl);
      
      return result;
    }
  }
  
  // Exportar instância única
  const cacheManager = new CacheManager();
  
  export default cacheManager;