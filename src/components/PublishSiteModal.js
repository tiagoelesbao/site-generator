// src/components/PublishSiteModal.js
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSiteContext } from '../context/SiteContext';
import { publishToNetlify } from '../utils/netlifyAPI';
import { setupZohoWithNetlify, forceZohoDemo } from '../utils/zohoAPI';
import { validateDomain } from '../utils/validators';
import { PUBLISHING_PLANS } from '../constants/publishingPlans';

// Importar componentes modularizados
import PlanSelection from './publish/PlanSelection';
import PaymentStep from './publish/PaymentStep';
import PublishingStatus from './publish/PublishingStatus';
import PublishSuccess from './publish/PublishSuccess';
import TokenInputForm from './publish/TokenInputForm';

function PublishSiteModal({ 
  isOpen, 
  onClose, 
  siteData, 
  zipBlob, 
  onPublishSuccess
}) {
  const { logger } = useSiteContext();
  const [selectedPlan, setSelectedPlan] = useState('BASIC');
  const [customDomain, setCustomDomain] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(1); 
  const [publishResult, setPublishResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [emailSetupResult, setEmailSetupResult] = useState(null);
  const [isSettingUpEmails, setIsSettingUpEmails] = useState(false);
  const [testingMode, setTestingMode] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  // Bloquear scroll quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);
  
  // Verificar token do Netlify ao montar o componente
  useEffect(() => {
    const storedToken = localStorage.getItem('netlify_token');
    
    if (process.env.NODE_ENV === 'development' && !storedToken) {
      setShowTokenInput(true);
    }
  }, []);
  
  // Garantir que os elementos do modal sejam visíveis
  useEffect(() => {
    if (isOpen) {
      // Pequeno timeout para garantir que o DOM foi atualizado
      setTimeout(() => {
        // Forçar visibilidade dos botões
        const buttons = document.querySelectorAll('.modal-actions button, .primary-button, .secondary-button');
        buttons.forEach(button => {
          button.style.opacity = '1';
          button.style.visibility = 'visible';
          button.style.pointerEvents = 'auto';
          button.style.cursor = 'pointer';
        });
        
        // Garantir que os planos estejam clicáveis
        const planCards = document.querySelectorAll('.plan-card');
        planCards.forEach(card => {
          card.style.cursor = 'pointer';
          card.style.pointerEvents = 'auto';
        });
      }, 300);
    }
  }, [isOpen, publishStep]);
  
  // Handlers para os componentes
  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    
    // Resetar domain se voltar para plano básico
    if (planId === 'BASIC') {
      setCustomDomain('');
      setTestingMode(false);
    }
  };
  
  const toggleTestingMode = () => {
    setTestingMode(!testingMode);
    if (!testingMode && !customDomain) {
      // Preenchimento automático de domínio para modo de teste
      setCustomDomain(siteData.empresa 
        ? `${siteData.empresa.toLowerCase().replace(/[^\w]/g, '')}.com.br`
        : 'exemplo.com.br');
    }
  };
  
  const handleSaveToken = (token) => {
    if (token.trim()) {
      try {
        localStorage.setItem('netlify_token', token.trim());
        setShowTokenInput(false);
        setPaymentError(null);
        logger.info('Token do Netlify salvo com sucesso');
      } catch (error) {
        logger.error('Erro ao salvar token', error);
        setPaymentError('Erro ao salvar token. Verifique as permissões do navegador.');
      }
    }
  };
  
  const handleContinueToPayment = () => {
    // Validar domínio para planos que precisam
    if (selectedPlan !== 'BASIC' && !testingMode) {
      if (!validateDomain(customDomain)) {
        setPaymentError('Por favor, insira um domínio válido.');
        logger.warn('Validação de domínio falhou', { domain: customDomain });
        return;
      }
    }
    
    logger.info('Avançando para etapa de pagamento', { 
      plan: selectedPlan, 
      domain: customDomain 
    });
    setPaymentError(null);
    setPublishStep(2);
  };
  
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setPaymentError(null);
      logger.info('Iniciando publicação do site', { 
        plan: selectedPlan, 
        testing: testingMode 
      });
      
      // Avançar para o estado de "publicando"
      setPublishStep(3);
      
      let result;
      
      // Sistema de retentativas
      const maxRetries = 3;
      let retryCount = 0;
      let success = false;
      
      while (retryCount < maxRetries && !success) {
        try {
          if (retryCount > 0) {
            logger.warn(`Tentativa ${retryCount + 1} de publicação`);
          }
          
          if (selectedPlan === 'BASIC') {
            result = await publishToNetlify(zipBlob, {
              name: siteData.empresa?.toLowerCase().replace(/[^\w]/g, '-') || 'meu-site'
            });
          } else {
            // Simulação para planos pagos
            result = createDemoResult();
            
            // Configuração de email para registro de domínio
            if (selectedPlan === 'DOMAIN_REGISTRATION') {
              setIsSettingUpEmails(true);
              try {
                const emailResult = await forceZohoDemo(
                  customDomain,
                  siteData.email || 'admin@example.com'
                );
                
                setEmailSetupResult(emailResult);
                result.emailSetup = emailResult;
              } catch (error) {
                logger.error('Erro na configuração de email', error);
                result.emailError = error.message;
              } finally {
                setIsSettingUpEmails(false);
              }
            }
          }
          
          success = true;
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw error;
          }
          
          // Esperar antes de tentar novamente (backoff exponencial)
          const delay = 2000 * Math.pow(2, retryCount - 1);
          logger.warn(`Erro na tentativa ${retryCount}. Aguardando ${delay}ms antes de tentar novamente`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      // Definir resultado e avançar para o próximo passo
      logger.info('Publicação concluída com sucesso', result);
      setPublishResult(result);
      setPublishStep(4);
      
      if (onPublishSuccess) {
        onPublishSuccess(result);
      }
    } catch (error) {
      logger.error('Erro na publicação', error);
      setPaymentError(`Erro ao publicar: ${error.message}`);
      setPublishStep(2); // Voltar para o passo anterior
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Função auxiliar para criar resultado de demonstração
  const createDemoResult = () => {
    const demoId = Math.random().toString(36).substring(2, 11);
    const siteName = siteData.empresa ? siteData.empresa.toLowerCase().replace(/[^\w]/g, '') : 'meu-site';
    
    return {
      siteId: `site_${demoId}`,
      deployId: `deploy_${demoId}`,
      siteUrl: `https://${siteName}-${demoId.substring(0,6)}.netlify.app`,
      netlifyUrl: `https://${siteName}-${demoId.substring(0,6)}.netlify.app`,
      site: {
        id: `site_${demoId}`,
        url: `https://${siteName}-${demoId.substring(0,6)}.netlify.app`,
      },
      status: 'success',
      demo_mode: true,
      domainInstructions: selectedPlan !== 'BASIC' ? {
        domain: customDomain,
        status: 'demo_mode',
        dns_instructions: [
          {
            type: 'CNAME',
            hostname: customDomain,
            value: `${siteName}-${demoId.substring(0,6)}.netlify.app`,
            ttl: 3600
          }
        ]
      } : null
    };
  };
  
  // Fechar modal e resetar estado
  const handleClose = () => {
    if (!isPublishing) {
      setPublishStep(1);
      setPaymentError(null);
      setPublishResult(null);
      setTestingMode(false);
      setShowTokenInput(false);
      logger.info('Modal de publicação fechado');
      onClose();
    }
  };
  
  // Usar createPortal para renderizar o modal diretamente no body
  if (!isOpen) return null;
  
  const modalContent = (
    <div className="modal-overlay">
      <div className="publish-modal">
        <div className="modal-header">
          <h2>Publicar Site</h2>
          <button className="close-button" onClick={handleClose} disabled={isPublishing}>×</button>
        </div>
        
        <div className="modal-content">
          {/* Input manual de token para desenvolvimento */}
          {showTokenInput && process.env.NODE_ENV === 'development' && (
            <TokenInputForm 
              manualToken={manualToken}
              setManualToken={setManualToken}
              onSaveToken={handleSaveToken}
              onCancel={() => setShowTokenInput(false)}
              onDemoMode={() => {
                setShowTokenInput(false);
                setTestingMode(true);
              }}
            />
          )}
          
          {/* Passo 1: Seleção de plano */}
          {!showTokenInput && publishStep === 1 && (
            <>
              <PlanSelection 
                selectedPlan={selectedPlan}
                onPlanChange={handlePlanChange}
                customDomain={customDomain}
                setCustomDomain={setCustomDomain}
                testingMode={testingMode}
                toggleTestingMode={toggleTestingMode}
                errorMessage={paymentError}
              />
              
              {/* Botões explícitos no final do modal */}
              <div 
                className="modal-actions" 
                style={{
                  marginTop: '30px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  opacity: 1,
                  visibility: 'visible'
                }}
              >
                <button 
                  className="secondary-button" 
                  onClick={handleClose}
                  disabled={isPublishing}
                  style={{
                    opacity: 1,
                    visibility: 'visible',
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  className="primary-button"
                  onClick={handleContinueToPayment}
                  disabled={isPublishing}
                  style={{
                    opacity: 1,
                    visibility: 'visible',
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                  }}
                >
                  Continuar
                </button>
              </div>
            </>
          )}
          
          {/* Passo 2: Pagamento */}
          {!showTokenInput && publishStep === 2 && (
            <PaymentStep 
              selectedPlan={selectedPlan}
              customDomain={customDomain}
              testingMode={testingMode}
              errorMessage={paymentError}
              onBack={() => setPublishStep(1)}
              onPublish={handlePublish}
              isPublishing={isPublishing}
            />
          )}
          
          {/* Passo 3: Publicação em andamento */}
          {publishStep === 3 && (
            <PublishingStatus 
              isSettingUpEmails={isSettingUpEmails}
              testingMode={testingMode}
            />
          )}
          
          {/* Passo 4: Publicação concluída */}
          {publishStep === 4 && publishResult && (
            <PublishSuccess 
              publishResult={publishResult}
              testingMode={testingMode}
              handleClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
}

export default PublishSiteModal;