// src/components/PublishSiteModal.js - Versão atualizada com modo de teste

import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, PUBLISHING_PLANS } from '../utils/stripeAPI';
import { deploySite, registerDomain } from '../utils/netlifyAPI';
import { simulateZohoSetup, forceZohoDemo } from '../utils/zohoAPI';
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
  const [emailSetupResult, setEmailSetupResult] = useState(null);
  const [isSettingUpEmails, setIsSettingUpEmails] = useState(false);
  const [testingMode, setTestingMode] = useState(false);
  
  const validateDomain = (domain) => {
    // Regex melhorada para suportar diversos TLDs incluindo compostos como .com.br
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
  
  // Testar apenas a configuração de e-mail
  const handleTestEmailSetup = async () => {
    try {
      setIsSettingUpEmails(true);
      setPaymentError(null);
      
      // Forçar simulação da configuração de e-mail
      const emailResult = await forceZohoDemo(
        customDomain,
        siteData.email || 'admin@example.com'
      );
      
      setEmailSetupResult(emailResult);
      
      // Criar um resultado de publicação simulado para exibir
      const simulatedResult = {
        siteId: 'site_' + Math.random().toString(36).substring(2, 11),
        deployId: 'deploy_' + Math.random().toString(36).substring(2, 11),
        siteUrl: 'https://site-teste.netlify.app',
        netlifyUrl: `https://site-teste.netlify.app`,
        status: 'success',
        domainInstructions: {
          domain: customDomain,
          status: 'demo_mode',
          dns_instructions: [
            {
              type: 'CNAME',
              hostname: customDomain,
              value: 'site-teste.netlify.app',
              ttl: 3600
            }
          ]
        },
        emailSetup: emailResult
      };
      
      setPublishResult(simulatedResult);
      setPublishStep(4);
      
    } catch (error) {
      console.error('Erro na simulação de email:', error);
      setPaymentError(`Erro ao simular configuração de email: ${error.message}`);
    } finally {
      setIsSettingUpEmails(false);
    }
  };
  
  // Processar pagamento e publicar
  // Atualização no método handlePublish do PublishSiteModal.js
  // Substitua a função handlePublish atual por esta versão:

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
      
      // Para planos pagos
      setPublishStep(3);
      
      // Se estamos no modo de teste, simulamos tudo
      if (testingMode) {
        // Simular deploy bem-sucedido
        const simulatedDeployResult = {
          siteId: 'site_' + Math.random().toString(36).substring(2, 11),
          deployId: 'deploy_' + Math.random().toString(36).substring(2, 11),
          siteUrl: `https://${siteData.empresa ? siteData.empresa.toLowerCase().replace(/[^\w]/g, '') : 'meu-site'}.netlify.app`,
          netlifyUrl: `https://${siteData.empresa ? siteData.empresa.toLowerCase().replace(/[^\w]/g, '') : 'meu-site'}.netlify.app`,
          status: 'success'
        };
        
        // Simular configuração de domínio
        simulatedDeployResult.domainInstructions = {
          domain: customDomain,
          status: 'demo_mode',
          dns_instructions: [
            {
              type: 'CNAME',
              hostname: customDomain,
              value: simulatedDeployResult.netlifyUrl,
              ttl: 3600
            }
          ]
        };
        
        // Simular setup de emails com configuração DNS automática
        setIsSettingUpEmails(true);
        const emailResult = await forceZohoDemo(
          customDomain,
          siteData.email || 'admin@example.com'
        );
        // Simulamos que a configuração DNS foi feita automaticamente
        emailResult.dnsConfigured = true;
        emailResult.emailSetupInstructions = "DNS configurado automaticamente! Suas caixas de email estarão ativas em breve.";
        
        setEmailSetupResult(emailResult);
        simulatedDeployResult.emailSetup = emailResult;
        setIsSettingUpEmails(false);
        
        setPublishResult(simulatedDeployResult);
        setPublishStep(4);
        
        if (onPublishSuccess) {
          onPublishSuccess(simulatedDeployResult);
        }
        
        return;
      }
      
      // Implementação real para produção
      
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
        
        // Setup de emails profissionais com Zoho, com configuração automática de DNS
        if (siteData.email) {
          setIsSettingUpEmails(true);
          
          const emailResult = await setupZohoWithNetlify(
            customDomain,
            siteData.email,
            deployResult.siteId,
            true // Indicamos que é um domínio registrado via Netlify
          );
          
          setEmailSetupResult(emailResult);
          setIsSettingUpEmails(false);
          
          // Adicionar resultado do setup de emails ao deployResult
          deployResult.emailSetup = emailResult;
        }
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
        
        // Setup de emails profissionais - neste caso o cliente precisa configurar o DNS manualmente
        if (siteData.email) {
          setIsSettingUpEmails(true);
          const emailResult = await simulateZohoSetup(
            customDomain,
            siteData.email
          );
          setEmailSetupResult(emailResult);
          setIsSettingUpEmails(false);
          
          // Adicionar resultado do setup de emails ao deployResult
          deployResult.emailSetup = emailResult;
        }
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
      setIsSettingUpEmails(false);
    }
  };
  
  // Fechar modal e resetar estado
  const handleClose = () => {
    if (!isPublishing) {
      setPublishStep(1);
      setPaymentError(null);
      setPublishResult(null);
      setTestingMode(false);
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
                      Modo de teste (para desenvolvimento)
                    </label>
                  </div>
                  {testingMode && (
                    <p className="testing-mode-note">
                      No modo de teste, o domínio não será verificado e a configuração de email será simulada para fins de desenvolvimento.
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
                      {testingMode && <p className="testing-mode-tag">MODO DE TESTE ATIVADO</p>}
                    </div>
                    
                    <p className="payment-notice">
                      {testingMode 
                        ? "Modo de teste ativado. O fluxo completo será simulado sem pagamento real."
                        : "Para o MVP, estamos simulando o pagamento. Clique em \"Publicar\" para continuar sem pagamento real."}
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
                
                {testingMode && selectedPlan !== 'BASIC' && (
                  <button 
                    className="test-button" 
                    onClick={handleTestEmailSetup}
                    disabled={isPublishing}
                  >
                    Testar apenas Email
                  </button>
                )}
                
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
              <div className="success-icon">✓</div>
              <h3>Site publicado com sucesso!</h3>
              
              {testingMode && (
                <div className="testing-mode-banner">
                  <p>⚠️ MODO DE TESTE ⚠️</p>
                  <p>Esta é uma simulação para fins de desenvolvimento.</p>
                </div>
              )}
              
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
              
              {/* Seção de resultados de email do Zoho */}
              {/* Seção de resultados de email do Zoho */}
              {publishResult.emailSetup && (
                <div className="email-setup-results">
                  <h4>Emails Profissionais Configurados</h4>
                  
                  {publishResult.emailSetup.success ? (
                    <>
                      <p className="success-message">
                        <span className="success-icon">✓</span> Seus emails profissionais foram configurados com sucesso!
                      </p>
                      
                      <div className="email-details">
                        <p><strong>Detalhes dos emails criados:</strong></p>
                        
                        {publishResult.emailSetup.emailAccounts.map((account, index) => (
                          <div key={index} className="email-account">
                            <h5>{account.address}</h5>
                            <p><strong>Senha temporária:</strong> {account.password}</p>
                            <p className="security-note">Anote esta senha! Por segurança, ela só será exibida uma vez.</p>
                          </div>
                        ))}
                        
                        <p><strong>Acesse seus emails em:</strong> <a href={publishResult.emailSetup.loginUrl} target="_blank" rel="noopener noreferrer">{publishResult.emailSetup.loginUrl}</a></p>
                        
                        {/* Condicionalmente mostrar instruções DNS ou mensagem de configuração automática */}
                        {publishResult.emailSetup.dnsConfigured ? (
                          <div className="dns-auto-configured">
                            <div className="auto-dns-badge">
                              <span className="auto-icon">✓</span> DNS Configurado Automaticamente
                            </div>
                            <p>Todas as configurações DNS necessárias para seus emails foram feitas automaticamente! </p>
                            <p>O processo de verificação e ativação pode levar até 24-48 horas. Após este período, suas caixas de email estarão prontas para uso.</p>
                            
                            {/* Tempo estimado para disponibilidade */}
                            <div className="email-ready-estimate">
                              <h5>Tempo estimado até disponibilidade:</h5>
                              <div className="time-estimate-bar">
                                <div className="time-stages">
                                  <div className="time-stage active">
                                    <div className="stage-icon">✓</div>
                                    <div className="stage-label">Configurado</div>
                                  </div>
                                  <div className="time-stage">
                                    <div className="stage-icon">⟳</div>
                                    <div className="stage-label">Propagação<br/>(24h)</div>
                                  </div>
                                  <div className="time-stage">
                                    <div className="stage-icon">✉</div>
                                    <div className="stage-label">Pronto</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="dns-setup">
                              <p><strong>Para ativar seus emails, adicione estes registros DNS:</strong></p>
                              
                              <div className="dns-records">
                                {publishResult.emailSetup.emailSetupRecords.map((record, index) => (
                                  <div key={index} className="dns-record">
                                    <p><strong>Tipo:</strong> {record.type}</p>
                                    <p><strong>Nome/Host:</strong> {record.name}</p>
                                    <p><strong>Valor/Destino:</strong> {record.value}</p>
                                    {record.priority && <p><strong>Prioridade:</strong> {record.priority}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="domain-verification">
                              <h5>Verificação de Domínio</h5>
                              <p>Para comprovar que você é o proprietário do domínio, adicione também estes registros:</p>
                              
                              <div className="dns-records">
                                {publishResult.emailSetup.verificationRecords.map((record, index) => (
                                  <div key={index} className="dns-record">
                                    <p><strong>Tipo:</strong> {record.type}</p>
                                    <p><strong>Nome/Host:</strong> {record.name}</p>
                                    <p><strong>Valor/Destino:</strong> {record.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="email-usage">
                        <h5>Próximos passos:</h5>
                        <ol>
                          {!publishResult.emailSetup.dnsConfigured && (
                            <li>Adicione todos os registros DNS acima no seu provedor de domínio</li>
                          )}
                          <li>Aguarde a {publishResult.emailSetup.dnsConfigured ? 'finalização do processo de ativação' : 'propagação DNS'} (pode levar até 24-48 horas)</li>
                          <li>Faça login no Zoho Mail com os emails e senhas acima</li>
                          <li>Altere as senhas temporárias por segurança</li>
                          <li>Configure encaminhamento ou acessos adicionais se necessário</li>
                        </ol>
                      </div>
                    </>
                  ) : (
                    <div className="error-message">
                      <p><strong>Erro na configuração de emails:</strong> {publishResult.emailSetup.error}</p>
                      <p>Você pode tentar configurar seus emails manualmente mais tarde no painel do Zoho Mail.</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-actions">
                <button className="secondary-button" onClick={handleClose}>Fechar</button>
                {!testingMode && (
                  <a 
                    href={publishResult.netlifyUrl}
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