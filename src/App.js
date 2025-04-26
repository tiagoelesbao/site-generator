// src/App.js
import React, { useEffect } from 'react';
import Form from './components/Form';
import DownloadButton from './components/DownloadButton';
import Logo from './components/Logo';
import { SiteProvider, useSiteContext } from './context/SiteContext';
import './styles/premium-theme.css';

function createParticlesEffect() {
  // Verificar se já existe um canvas de partículas
  if (document.querySelector('.particles-canvas')) {
    return;
  }
  
  const canvas = document.createElement('canvas');
  canvas.className = 'particles-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  for (let i = 0; i < 50; i++) {
    // Usando tons de branco/cinza em vez de cores
    const opacity = Math.random() * 0.2 + 0.05; // Opacidade entre 0.05 e 0.25
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      color: `rgba(255, 255, 255, ${opacity})`, // Branco com opacidade variável
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar partículas
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      
      // Atualizar posição
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Verificar bordas
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    });
    
    // Desenhar conexões
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          // Conexões em branco com opacidade variando pela distância
          const opacity = (1 - distance/150) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(draw);
  }
  
  draw();
  
  // Ajustar no redimensionamento da janela
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

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

  // Inicializar animações quando o componente montar
  useEffect(() => {
    // Inicializar o efeito de partículas
    setTimeout(createParticlesEffect, 500);
    
    // Forçar visibilidade de elementos com fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
    });
    
    // Adicionar classe para indicar que a página está carregada
    document.body.classList.add('app-loaded');
    
    return () => {
      // Limpar quando o componente desmontar
      const canvas = document.querySelector('.particles-canvas');
      if (canvas) {
        canvas.remove();
      }
    };
  }, []);

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