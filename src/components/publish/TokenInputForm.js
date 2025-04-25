// src/components/publish/TokenInputForm.js
import React from 'react';

function TokenInputForm({
  manualToken,
  setManualToken,
  onSaveToken,
  onCancel,
  onDemoMode
}) {
  return (
    <div className="token-input-container">
      <h4>Inserir Token do Netlify</h4>
      <p className="token-note">Apenas para ambiente de desenvolvimento. Insira um token de API válido do Netlify.</p>
      <div className="token-input-group">
        <input
          type="text"
          value={manualToken}
          onChange={(e) => setManualToken(e.target.value)}
          placeholder="Seu token de API do Netlify"
          className="token-field"
        />
        <button 
          onClick={() => onSaveToken(manualToken)}
          className="token-save-btn"
          disabled={!manualToken.trim()}
        >
          Salvar
        </button>
      </div>
      <div className="token-actions">
        <button 
          onClick={onCancel}
          className="secondary-button"
        >
          Cancelar
        </button>
        <button 
          onClick={onDemoMode}
          className="primary-button"
        >
          Usar Modo de Demonstração
        </button>
      </div>
    </div>
  );
}

export default TokenInputForm;
