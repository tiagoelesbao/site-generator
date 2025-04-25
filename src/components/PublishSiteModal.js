// src/components/PublishSiteModal.js - Versão corrigida com estilo premium
import React, { useState, useEffect } from 'react';
import { publishToNetlify, setNetlifyToken } from '../utils/netlifyAPI';
import { simulateZohoSetup, forceZohoDemo, setupZohoWithNetlify } from '../utils/zohoAPI';

// Constantes para planos
const PUBLISHING_PLANS = {
  BASIC: {
    id: 'basic_publishing',
    name: 'Publicação Básica',
    description: 'Publicação do site com subdomínio gratuito',
    price: 0,
    features: [
      'Hospedagem na Netlify',
      'Subdomínio gratuito (seusite.netlify.app)',
      'HTTPS incluído',
      'Sem limite de tráfego'
    ],
    icon: 'cloud_upload'
  },
  CUSTOM_DOMAIN: {
    id: 'custom_domain',
    name: 'Domínio Personalizado',
    description: 'Publicação com seu domínio personalizado',
    price: 1500, // R$ 15,00 em centavos
    features: [
      'Todos os recursos do plano básico',
      'Uso de domínio próprio',
      'Configuração automática de DNS',
      'Certificado SSL gratuito'
    ],
    icon: 'language'
  },
  DOMAIN_REGISTRATION: {
    id: 'domain_registration',
    name: 'Registro de Domínio',
    description: 'Registre um novo domínio e publique seu site',
    price: 4500, // R$ 45,00 em centavos
    features: [
      'Todos os recursos do plano com domínio personalizado',
      'Registro de domínio .com.br por 1 ano',
      'Renovação automática opcional',
      'Painel de gerenciamento do domínio'
    ],
    icon: 'verified'
  }
};

function PublishSiteModal({ 
  isOpen, 
  onClose, 
  siteData, 
  zipBlob, 
  onPublishSuccess
}) {
  const [selectedPlan, setSelectedPlan] = useState('BASIC');
  const [customDomain, setCustomDomain] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(1); // 1: Selecionar plano, 2: Pagamento, 3: Publicação, 4: Concluído
  const [publishResult, setPublishResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [emailSetupResult, setEmailSetupResult] = useState(null);
  const [isSettingUpEmails, setIsSettingUpEmails] = useState(false);
  const [testingMode, setTestingMode] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  // Verificar token do Netlify ao montar o componente
  useEffect(() => {
    // Verificar se já temos um token no localStorage
    const storedToken = localStorage.getItem('netlify_token');
    
    // Se não houver token e estiver em ambiente de desenvolvimento, mostrar opção
    if (process.env.NODE_ENV === 'development' && !storedToken) {
      setShowTokenInput(true);
    }
  }, []);
  
  const validateDomain = (domain) => {
    // Regex para validar domínios
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
  };
  
  // Handler para mudança de plano
  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    
    // Resetar domain se voltar para plano básico
    if (planId === 'BASIC') {
      setCustomDomain('');
      setTestingMode(false);
    }
  };
  
  // Toggle modo de teste
  const toggleTestingMode = () => {
    setTestingMode(!testingMode);
    if (!testingMode && !customDomain) {
      // Preenchimento automático de domínio para modo de teste
      setCustomDomain(siteData.empresa 
        ? `${siteData.empresa.toLowerCase().replace(/[^\w]/g, '')}.com.br`
        : 'exemplo.com.br');
    }
  };
  
  // Salvar token manual
  const handleSaveToken = () => {
    if (manualToken.trim()) {
      setNetlifyToken(manualToken.trim());
      setShowTokenInput(false);
      setPaymentError(null);
    }
  };
  
  // Avançar para o passo de pagamento
  const handleContinueToPayment = () => {
    // Validar domínio para planos que precisam (ignorar em modo de teste)
    if (selectedPlan !== 'BASIC' && !testingMode && !validateDomain(customDomain)) {
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
      setPublishStep(3);
      
      // Criar resultados de demonstração para todos os modos por enquanto
      const demoResult = createDemoResult();
      
      // Simulação de configuração de email para planos com domínio
      if (selectedPlan !== 'BASIC') {
        setIsSettingUpEmails(true);
        try {
          const emailResult = await forceZohoDemo(
            customDomain,
            siteData.email || 'admin@example.com'
          );
          
          // Simulamos que a configuração DNS foi feita automaticamente
          emailResult.dnsConfigured = true;
          emailResult.emailSetupInstructions = "DNS configurado automaticamente! Suas caixas de email estarão ativas em breve.";
          
          setEmailSetupResult(emailResult);
          demoResult.emailSetup = emailResult;
        } catch (error) {
          console.error('Erro na configuração de email:', error);
          demoResult.emailError = error.message;
        } finally {
          setIsSettingUpEmails(false);
        }
      }
      
      // Definir resultado e avançar para o passo final
      setPublishResult(demoResult);
      setPublishStep(4);
      
      if (onPublishSuccess) {
        onPublishSuccess(demoResult);
      }
      
    } catch (error) {
      console.error('Erro na publicação:', error);
      setPaymentError(`Erro ao publicar: ${error.message}`);
    } finally {
      setIsPublishing(false);
      setIsSettingUpEmails(false);
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
      onClose();
    }
  };
  
  // Renderizar ícone do plano
  const renderPlanIcon = (iconName) => {
    // SVG icons com estilos premium
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
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="publish-modal">
        <div className="modal-header">
          <h2>Publicar Site</h2>
          <button className="close-button" onClick={handleClose} disabled={isPublishing}>×</button>
        </div>
        
        <div className="modal-content">
          {/* Input manual de token para desenvolvimento */}
          {showTokenInput && process.env.NODE_ENV === 'development' && (
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
                  onClick={handleSaveToken}
                  className="token-save-btn"
                  disabled={!manualToken.trim()}
                >
                  Salvar
                </button>
              </div>
              <div className="token-actions">
                <button 
                  onClick={() => setShowTokenInput(false)}
                  className="secondary-button"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setShowTokenInput(false);
                    setTestingMode(true);
                  }}
                  className="primary-button"
                >
                  Usar Modo de Demonstração
                </button>
              </div>
            </div>
          )}
          
          {/* Passo 1: Seleção de plano */}
          {!showTokenInput && publishStep === 1 && (
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
                    onChange={(e) => setCustomDomain(e.target.value)}
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
          {!showTokenInput && publishStep === 2 && (
            <div className="payment-section">
              <h3>Pagamento</h3>
              
              {selectedPlan !== 'BASIC' ? (
                <div className="payment-summary">
                  <h4>Resumo do pedido</h4>
                  <div className="payment-details">
                    <p><strong>Plano:</strong> {PUBLISHING_PLANS[selectedPlan].name}</p>
                    <p><strong>Valor:</strong> R$ {(PUBLISHING_PLANS[selectedPlan].price / 100).toFixed(2)}</p>
                    {customDomain && <p><strong>Domínio:</strong> {customDomain}</p>}
                    {testingMode && <p className="testing-mode-tag">MODO DE TESTE ATIVADO</p>}
                  </div>
                  
                  <p className="payment-notice">
                    {testingMode 
                      ? "Modo de teste ativado. O fluxo completo será simulado sem pagamento real."
                      : "Estamos simulando o pagamento. Clique em \"Publicar\" para continuar sem pagamento real."}
                  </p>
                </div>
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
              <div className="loader">
                <div className="loader-inner"></div>
              </div>
              <h3>Publicando seu site...</h3>
              <p>Esse processo pode levar alguns instantes.</p>
              {isSettingUpEmails && (
                <p>Configurando emails profissionais...</p>
              )}
              {testingMode && (
                <p className="testing-mode-tag">MODO DE TESTE ATIVADO</p>
              )}
            </div>
          )}
          
          {/* Passo 4: Publicação concluída */}
          {publishStep === 4 && publishResult && (
            <div className="publish-success">
              <div className="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L19 8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Site publicado com sucesso!</h3>
              
              {(testingMode || publishResult.demo_mode) && (
                <div className="testing-banner">
                  <p>⚠️ MODO DE DEMONSTRAÇÃO ⚠️</p>
                  <p>Esta é uma simulação para fins de desenvolvimento.</p>
                </div>
              )}
              
              <div className="site-info">
                <p><strong>URL do site:</strong></p>
                <a 
                  href={publishResult.netlifyUrl || publishResult.site?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="site-url"
                >
                  {publishResult.netlifyUrl || publishResult.site?.url}
                </a>
                
                {publishResult.domainInstructions && (
                  <div className="domain-instructions">
                    <h4>Configuração de DNS necessária:</h4>
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
              
              {/* Seção de resultados de email */}
              {publishResult.emailSetup && (
                <div className="email-setup-results">
                  <h4>Emails Profissionais Configurados</h4>
                  
                  {publishResult.emailSetup.success ? (
                    <>
                      <div className="email-success">
                        <span className="success-check">✓</span> 
                        Seus emails profissionais foram configurados com sucesso!
                      </div>
                      
                      <div className="email-accounts">
                        <p><strong>Detalhes dos emails criados:</strong></p>
                        
                        {publishResult.emailSetup.emailAccounts.map((account, index) => (
                          <div key={index} className="email-account-card">
                            <div className="email-account-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="1.5"/>
                                <path d="M22 7L13.03 12.7756C12.3851 13.1924 11.6149 13.1924 10.97 12.7756L2 7" stroke="white" strokeWidth="1.5"/>
                              </svg>
                            </div>
                            <div className="email-account-info">
                              <h5>{account.address}</h5>
                              <div className="password-field">
                                <span className="password-label">Senha:</span>
                                <span className="password-value">{account.password}</span>
                              </div>
                              <p className="security-note">Anote esta senha! Por segurança, ela só será exibida uma vez.</p>
                            </div>
                          </div>
                        ))}
                        
                        <p className="email-login-info">
                          <strong>Acesse seus emails em:</strong> 
                          <a href={publishResult.emailSetup.loginUrl} target="_blank" rel="noopener noreferrer" 
                            className="email-login-link">
                            {publishResult.emailSetup.loginUrl}
                          </a>
                        </p>
                        
                        {/* Status de configuração DNS */}
                        {publishResult.emailSetup.dnsConfigured ? (
                          <div className="dns-auto-configured">
                            <div className="auto-dns-badge">
                              <span className="auto-icon">✓</span> DNS Configurado Automaticamente
                            </div>
                            <p>Todas as configurações DNS necessárias para seus emails foram feitas automaticamente!</p>
                            <p>O processo de verificação e ativação pode levar até 24-48 horas.</p>
                          </div>
                        ) : (
                          <div className="dns-manual-setup">
                            <h5>Configuração Manual Necessária</h5>
                            <p>Para ativar seus emails, adicione estes registros DNS no seu provedor de domínio:</p>
                            
                            <div className="dns-records-list">
                              {/* Lista de registros DNS omitida por brevidade */}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="email-setup-error">
                      <p><strong>Erro na configuração de emails:</strong> {publishResult.emailSetup.error}</p>
                      <p>Você pode tentar configurar seus emails manualmente mais tarde.</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-actions">
                <button className="secondary-button" onClick={handleClose}>Fechar</button>
                {!testingMode && !publishResult.demo_mode && (
                  <a 
                    href={publishResult.netlifyUrl || publishResult.site?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-button visit-button"
                  >
                    Visitar Site
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublishSiteModal;