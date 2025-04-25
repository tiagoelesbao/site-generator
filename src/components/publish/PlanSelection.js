// src/components/publish/PlanSelection.js
import React from 'react';
import { PUBLISHING_PLANS } from '../../constants/publishingPlans';
import { sanitizeInput } from '../../utils/security';

function PlanSelection({ 
  selectedPlan, 
  onPlanChange, 
  customDomain, 
  setCustomDomain, 
  testingMode, 
  toggleTestingMode, 
  errorMessage 
}) {
  return (
    <div className="plan-selection">
      <h3 className="publish-step-title">Escolha um plano de publicação</h3>
      
      <div className="plans-grid">
        {Object.keys(PUBLISHING_PLANS).map((planKey) => {
          const plan = PUBLISHING_PLANS[planKey];
          return (
            <div 
              key={planKey}
              className={`plan-card ${selectedPlan === planKey ? 'selected' : ''}`}
              onClick={() => onPlanChange(planKey)}
            >
              <div className="plan-card-inner">
                <div className="plan-icon">
                  {renderPlanIcon(plan.icon)}
                </div>
                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <p className="plan-price">
                    {plan.price === 0 ? 
                      <span className="free-tag">Grátis</span> : 
                      `R$ ${(plan.price / 100).toFixed(2)}`
                    }
                  </p>
                </div>
                
                <p className="plan-description">{plan.description}</p>
                
                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {selectedPlan === planKey && (
                  <div className="selected-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1.5"/>
                      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Campo de domínio para planos pagos */}
      {selectedPlan !== 'BASIC' && (
        <div className="domain-input-container">
          <label htmlFor="custom-domain">Domínio:</label>
          <input
            type="text"
            id="custom-domain"
            placeholder="exemplo.com.br"
            value={customDomain}
            onChange={(e) => setCustomDomain(sanitizeInput(e.target.value))}
            className={testingMode ? "testing-mode-input" : ""}
          />
          <p className="domain-hint">
            {selectedPlan === 'DOMAIN_REGISTRATION' 
              ? 'Domínio a ser registrado' 
              : 'Domínio que você já possui'}
          </p>
          
          {/* Opção de modo de teste */}
          <div className="testing-mode-option">
            <input
              type="checkbox"
              id="testing-mode"
              checked={testingMode}
              onChange={toggleTestingMode}
            />
            <label htmlFor="testing-mode" className="testing-label">
              Modo de teste
            </label>
          </div>
          {testingMode && (
            <p className="testing-mode-note">
              No modo de teste, o domínio não será verificado e a configuração será simulada.
            </p>
          )}
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">
          <div className="error-icon">!</div>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

// Renderizar ícone do plano
const renderPlanIcon = (iconName) => {
  // Implementação do renderPlanIcon (manter o código existente)
  switch(iconName) {
    case 'cloud_upload':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 16V21H5V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3V16M12 3L8 7M12 3L16 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'language':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
          <path d="M12 2C16.9706 2 21 6.02944 21 11C21 15.9706 16.9706 20 12 20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2 12H22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M12 2V22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'verified':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
};

export default PlanSelection;