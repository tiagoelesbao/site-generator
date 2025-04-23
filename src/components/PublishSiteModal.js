// Arquivo: src/components/PublishSiteModal.js

import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, PUBLISHING_PLANS } from '../utils/stripeAPI';
import { deploySite, registerDomain } from '../utils/netlifyAPI';
import '../styles/publishSite.css';

function PublishSiteModal({ 
  isOpen, 
  onClose, 
  siteData, 
  zipBlob, 
  onPublishSuccess, 
  onPublishError 
}) {
  const [selectedPlan, setSelectedPlan] = useState('BASIC');
  const [customDomain, setCustomDomain] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(1); // 1: Selecionar plano, 2: Pagamento, 3: Publicação, 4: Concluído
  const [publishResult, setPublishResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  
  // Validação de domínio
  const validateDomain = (domain) => {
    // Regex básica para validação de domínio
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };
  
  // Handler para mudança de plano
  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    
    // Resetar domain se voltar para plano básico
    if (planId === 'BASIC') {
      setCustomDomain('');
    }
  };
  
  // Avançar para o passo de pagamento
  const handleContinueToPayment = () => {
    // Validar domínio para planos que precisam
    if (selectedPlan !== 'BASIC' && !validateDomain(customDomain)) {
      setPaymentError('Por favor, insira um domínio válido.');
      return;
    }
    
    setPaymentError(null);
    setPublishStep(2);
  };
  
  // Processar pagamento e publicar
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setPaymentError(null);
      
      // Para o plano gratuito, pulamos o pagamento
      if (selectedPlan === 'BASIC') {
        setPublishStep(3);
        
        // Deploy do site
        const deployResult = await deploySite(
          zipBlob, 
          siteData.empresa || 'meu-site'
        );
        
        setPublishResult(deployResult);
        setPublishStep(4);
        
        if (onPublishSuccess) {
          onPublishSuccess(deployResult);
        }
        
        return;
      }
      
      // Para planos pagos, primeiro processamos o pagamento
      // Simulação de pagamento bem-sucedido para o MVP
      // Em produção, você usaria o fluxo completo do Stripe
      setPublishStep(3);
      
      // Deploy do site
      const deployResult = await deploySite(
        zipBlob, 
        siteData.empresa || 'meu-site'
      );
      
      // Se o plano inclui registro de domínio
      if (selectedPlan === 'DOMAIN_REGISTRATION') {
        const domainResult = await registerDomain(
          deployResult.siteId,
          customDomain
        );
        
        deployResult.domain = domainResult;
      }
      // Se o plano é de domínio personalizado (cliente já tem o domínio)
      else if (selectedPlan === 'CUSTOM_DOMAIN') {
        deployResult.domainInstructions = {
          domain: customDomain,
          status: 'pending_setup',
          dns_instructions: [
            {
              type: 'CNAME',
              hostname: customDomain,
              value: deployResult.netlifyUrl,
              ttl: 3600
            }
          ]
        };
      }
      
      setPublishResult(deployResult);
      setPublishStep(4);
      
      if (onPublishSuccess) {
        onPublishSuccess(deployResult);
      }
    } catch (error) {
      console.error('Erro na publicação:', error);
      setPaymentError(`Erro ao publicar: ${error.message}`);
      
      if (onPublishError) {
        onPublishError(error);
      }
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Fechar modal e resetar estado
  const handleClose = () => {
    if (!isPublishing) {
      setPublishStep(1);
      setPaymentError(null);
      setPublishResult(null);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="publish-modal">
        <div className="modal-header">
          <h2>Publicar Site</h2>
          <button className="close-button" onClick={handleClose} disabled={isPublishing}>×</button>
        </div>
        
        <div className="modal-content">
          {/* Passo 1: Seleção de plano */}
          {publishStep === 1 && (
            <div className="plan-selection">
              <h3>Escolha um plano de publicação</h3>
              
              <div className="plans-grid">
                {Object.keys(PUBLISHING_PLANS).map((planKey) => {
                  const plan = PUBLISHING_PLANS[planKey];
                  return (
                    <div 
                      key={planKey}
                      className={`plan-card ${selectedPlan === planKey ? 'selected' : ''}`}
                      onClick={() => handlePlanChange(planKey)}
                    >
                      <div className="plan-header">
                        <h4>{plan.name}</h4>
                        <p className="plan-price">
                          {plan.price === 0 ? 
                            'Grátis' : 
                            `R$ ${(plan.price / 100).toFixed(2)}`
                          }
                        </p>
                      </div>
                      
                      <p className="plan-description">{plan.description}</p>
                      
                      <ul className="plan-features">
                        {plan.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              
              {/* Campo de domínio para planos pagos */}
              {selectedPlan !== 'BASIC' && (
                <div className="domain-input">
                  <label htmlFor="custom-domain">Domínio:</label>
                  <input
                    type="text"
                    id="custom-domain"
                    placeholder="exemplo.com.br"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                  <p className="domain-hint">
                    {selectedPlan === 'DOMAIN_REGISTRATION' 
                      ? 'Domínio a ser registrado' 
                      : 'Domínio que você já possui'}
                  </p>
                </div>
              )}
              
              {paymentError && <p className="error-message">{paymentError}</p>}
              
              <div className="modal-actions">
                <button className="secondary-button" onClick={handleClose}>Cancelar</button>
                <button className="primary-button" onClick={handleContinueToPayment}>
                  Continuar
                </button>
              </div>
            </div>
          )}
          
          {/* Passo 2: Pagamento (para planos pagos) */}
          {publishStep === 2 && (
            <div className="payment-section">
              <h3>Pagamento</h3>
              
              {selectedPlan !== 'BASIC' ? (
                <Elements stripe={stripePromise}>
                  {/* Aqui você implementaria o formulário de pagamento do Stripe */}
                  <div className="payment-summary">
                    <h4>Resumo do pedido</h4>
                    <div className="payment-details">
                      <p><strong>Plano:</strong> {PUBLISHING_PLANS[selectedPlan].name}</p>
                      <p><strong>Valor:</strong> R$ {(PUBLISHING_PLANS[selectedPlan].price / 100).toFixed(2)}</p>
                      {customDomain && <p><strong>Domínio:</strong> {customDomain}</p>}
                    </div>
                    
                    <p className="payment-notice">
                      Para o MVP, estamos simulando o pagamento. 
                      Clique em "Publicar" para continuar sem pagamento real.
                    </p>
                  </div>
                </Elements>
              ) : (
                <div className="free-plan-notice">
                  <p>Você selecionou o plano gratuito. Não é necessário pagamento.</p>
                </div>
              )}
              
              {paymentError && <p className="error-message">{paymentError}</p>}
              
              <div className="modal-actions">
                <button 
                  className="secondary-button" 
                  onClick={() => setPublishStep(1)}
                  disabled={isPublishing}
                >
                  Voltar
                </button>
                <button 
                  className="primary-button" 
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? 'Processando...' : 'Publicar Agora'}
                </button>
              </div>
            </div>
          )}
          
          {/* Passo 3: Publicação em andamento */}
          {publishStep === 3 && (
            <div className="publishing-status">
              <div className="loader"></div>
              <h3>Publicando seu site...</h3>
              <p>Esse processo pode levar alguns instantes.</p>
            </div>
          )}
          
          {/* Passo 4: Publicação concluída */}
          {publishStep === 4 && publishResult && (
            <div className="publish-success">
              <div className="success-icon">✓</div>
              <h3>Site publicado com sucesso!</h3>
              
              <div className="site-info">
                <p><strong>URL do site:</strong></p>
                <a 
                  href={publishResult.netlifyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="site-url"
                >
                  {publishResult.netlifyUrl}
                </a>
                
                {publishResult.domain && (
                  <div className="domain-info">
                    <p><strong>Status do domínio:</strong> {publishResult.domain.status}</p>
                    <p>O processo de registro do domínio está em andamento e pode levar até 24 horas para ser concluído.</p>
                  </div>
                )}
                
                {publishResult.domainInstructions && (
                  <div className="domain-instructions">
                    <p><strong>Configuração de DNS necessária:</strong></p>
                    <p>Para que seu domínio personalizado funcione, você precisa configurar os seguintes registros DNS:</p>
                    
                    <div className="dns-records">
                      {publishResult.domainInstructions.dns_instructions.map((record, index) => (
                        <div key={index} className="dns-record">
                          <p><strong>Tipo:</strong> {record.type}</p>
                          <p><strong>Nome/Host:</strong> {record.hostname}</p>
                          <p><strong>Valor/Destino:</strong> {record.value}</p>
                          <p><strong>TTL:</strong> {record.ttl}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button className="secondary-button" onClick={handleClose}>Fechar</button>
                <a 
                  href={publishResult.netlifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button visit-button"
                >
                  Visitar Site
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublishSiteModal;