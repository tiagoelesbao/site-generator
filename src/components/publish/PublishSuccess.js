// src/components/publish/PublishSuccess.js
import React from 'react';

function PublishSuccess({ 
  publishResult, 
  testingMode, 
  handleClose 
}) {
  return (
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
      
      <SiteInfo publishResult={publishResult} />
      
      {/* Seção de resultados de email */}
      {publishResult.emailSetup && (
        <EmailSetupResults emailSetup={publishResult.emailSetup} />
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
  );
}

// Componentes auxiliares
function SiteInfo({ publishResult }) {
  return (
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
  );
}

function EmailSetupResults({ emailSetup }) {
  return (
    <div className="email-setup-results">
      <h4>Emails Profissionais Configurados</h4>
      
      {emailSetup.success ? (
        <>
          <div className="email-success">
            <span className="success-check">✓</span> 
            Seus emails profissionais foram configurados com sucesso!
          </div>
          
          <div className="email-accounts">
            <p><strong>Detalhes dos emails criados:</strong></p>
            
            {emailSetup.emailAccounts.map((account, index) => (
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
              <a href={emailSetup.loginUrl} target="_blank" rel="noopener noreferrer" 
                className="email-login-link">
                {emailSetup.loginUrl}
              </a>
            </p>
            
            {/* Status de configuração DNS */}
            {emailSetup.dnsConfigured ? (
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
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="email-setup-error">
          <p><strong>Erro na configuração de emails:</strong> {emailSetup.error}</p>
          <p>Você pode tentar configurar seus emails manualmente mais tarde.</p>
        </div>
      )}
    </div>
  );
}

export default PublishSuccess;