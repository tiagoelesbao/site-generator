// src/components/publish/PaymentStep.js
import React from 'react';
import { PUBLISHING_PLANS } from '../../constants/publishingPlans';

function PaymentStep({ 
  selectedPlan, 
  customDomain, 
  testingMode, 
  errorMessage, 
  onBack, 
  onPublish,
  isPublishing 
}) {
  return (
    <div className="payment-section">
      <h3 className="publish-step-title">Pagamento</h3>
      
      {selectedPlan !== 'BASIC' ? (
        <div className="payment-summary">
          <h4>Resumo do pedido</h4>
          <div className="payment-details">
            <p><strong>Plano:</strong> {PUBLISHING_PLANS[selectedPlan].name}</p>
            <p><strong>Valor:</strong> R$ {(PUBLISHING_PLANS[selectedPlan].price / 100).toFixed(2)}</p>
            {customDomain && <p><strong>Domínio:</strong> {customDomain}</p>}
            {testingMode && <div className="testing-mode-tag">MODO DE TESTE ATIVADO</div>}
          </div>
          
          <div className="payment-notice">
            {testingMode 
              ? "Modo de teste ativado. O fluxo completo será simulado sem pagamento real."
              : "Estamos simulando o pagamento. Clique em \"Publicar\" para continuar sem pagamento real."}
          </div>
        </div>
      ) : (
        <div className="free-plan-notice">
          <div className="success-icon">✓</div>
          <p>Você selecionou o plano gratuito. Não é necessário pagamento.</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">
          <div className="error-icon">!</div>
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="modal-actions">
        <button 
          className="secondary-button" 
          onClick={onBack}
          disabled={isPublishing}
        >
          Voltar
        </button>
        
        <button 
          className="primary-button" 
          onClick={onPublish}
          disabled={isPublishing}
        >
          {isPublishing ? 'Processando...' : 'Publicar Agora'}
        </button>
      </div>
    </div>
  );
}

export default PaymentStep;