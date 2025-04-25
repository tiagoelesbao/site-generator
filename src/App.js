// src/App.js (modificado)
import React from 'react';
import Form from './components/Form';
import DownloadButton from './components/DownloadButton';
import Logo from './components/Logo';
import { SiteProvider, useSiteContext } from './context/SiteContext';
import './styles/premium-theme.css';

// Componente App principal que usa o contexto
function AppContent() {
  const { state, actions } = useSiteContext();
  const { 
    formData, 
    heroImage, 
    isGenerating, 
    isGenerated, 
    generationError, 
    publishResult 
  } = state;

  // Handlers simplificados que usam actions do contexto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    actions.updateFormField(name, value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar tamanho da imagem (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        actions.setGenerationError("A imagem é muito grande. O tamanho máximo é 5MB.");
        return;
      }
      
      actions.setHeroImage(file);
    }
  };

  return (
    <div className="app-container">
      <div className="glowing-overlay"></div>
      <header className="app-header fade-in">
        <Logo />
        <h1 className="app-title fade-in">Gerador de Sites</h1>
        <p className="app-subtitle fade-in">Crie um site profissional em minutos</p>
      </header>
      
      <main className="app-main">
        <div className="form-wrapper fade-in" data-delay="2">
          <Form 
            formData={formData}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            disabled={isGenerating}
          />
        </div>
        
        <div className="actions-wrapper fade-in" data-delay="3">
          <DownloadButton 
            formData={formData}
            heroImage={heroImage}
            isGenerating={isGenerating}
            setIsGenerating={actions.setIsGenerating}
            setIsGenerated={actions.setIsGenerated}
            setGenerationError={actions.setGenerationError}
            onPublishSuccess={actions.setPublishResult}
          />
        </div>
        
        {isGenerated && !generationError && !publishResult && (
          <div className="success-message fade-in" data-delay="4">
            <div className="success-icon">✓</div>
            <p>Site gerado com sucesso! O download deve começar automaticamente.</p>
          </div>
        )}
        
        {publishResult && (
          <div className="success-message published fade-in" data-delay="4">
            <div className="success-icon">✓</div>
            <p>Site publicado com sucesso! 
              {publishResult.site && publishResult.site.url && (
                <span className="site-url-wrapper">
                  URL: <a href={publishResult.site.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="site-url">{publishResult.site.url}</a>
                </span>
              )}
            </p>
          </div>
        )}
        
        {generationError && (
          <div className="error-message fade-in" data-delay="4">
            <div className="error-icon">!</div>
            <p>Erro: {generationError}</p>
            <button 
              onClick={() => actions.setGenerationError(null)}
              className="close-error-button"
            >
              Fechar
            </button>
          </div>
        )}
      </main>
      
      <footer className="app-footer fade-in" data-delay="5">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} SiteGenAI - Gerador de Sites</p>
          <div className="diamond-separator"></div>
        </div>
      </footer>
    </div>
  );
}

// Componente wrapper que fornece o contexto
function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}

export default App;