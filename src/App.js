// src/App.js - Versão refinada com nova identidade visual premium
import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import DownloadButton from './components/DownloadButton';
import Logo from './components/Logo';
import './styles/premium-theme.css';

function App() {
  const [formData, setFormData] = useState({
    empresa: '',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    email: '',
    emailLGPD: '',
    telefone: '',
    dominio: '',
    tituloHero: '',
    subtituloHero: '',
    servico1Nome: '',
    servico1Desc: '',
    servico2Nome: '',
    servico2Desc: '',
    servico3Nome: '',
    servico3Desc: '',
    quemSomos: ''
  });
  
  const [heroImage, setHeroImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [publishResult, setPublishResult] = useState(null);
  
  // Inicializar animações e verificar token Netlify
  useEffect(() => {
    initAnimations();
    
    const storedToken = localStorage.getItem('netlify_token');
    if (!storedToken && process.env.NODE_ENV === 'development') {
      console.info('Nenhum token Netlify encontrado para desenvolvimento');
    }
    
    if (generationError) {
      setGenerationError(null);
    }
  }, [formData, heroImage, generationError]);
  
  // Função para inicializar animações
  const initAnimations = () => {
    // Detectar elementos com a classe 'fade-in'
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.dataset.delay) {
            entry.target.style.transitionDelay = `${parseInt(entry.target.dataset.delay) * 0.1}s`;
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    fadeElements.forEach((el, index) => {
      el.dataset.delay = index;
      observer.observe(el);
    });
    
    // Adicionar canvas para efeito de partículas premium
    initPremiumParticles();
  };
  
  // Efeito de partículas premium para o fundo
  const initPremiumParticles = () => {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Configuração de partículas com efeito metálico/prateado
    const particles = [];
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        color: `rgba(${Math.floor(Math.random() * 30 + 225)}, ${Math.floor(Math.random() * 30 + 225)}, ${Math.floor(Math.random() * 30 + 225)}, ${Math.random() * 0.4 + 0.1})`,
        speedX: Math.random() * 0.8 - 0.4,
        speedY: Math.random() * 0.8 - 0.4
      });
    }
    
    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Atualizar posição
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Verificar bordas
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
      });
      
      // Conectar partículas próximas com linhas sutis
      connectParticles();
      
      requestAnimationFrame(drawParticles);
    }
    
    function connectParticles() {
      const maxDistance = 130;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(220, 220, 225, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Ajustar tamanho do canvas ao redimensionar a janela
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
    
    drawParticles();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar tamanho da imagem (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setGenerationError("A imagem é muito grande. O tamanho máximo é 5MB.");
        return;
      }
      
      setHeroImage(file);
    }
  };
  
  const handlePublishSuccess = (result) => {
    setPublishResult(result);
    setIsGenerated(true);
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
            setIsGenerating={setIsGenerating}
            setIsGenerated={setIsGenerated}
            setGenerationError={setGenerationError}
            onPublishSuccess={handlePublishSuccess}
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
              onClick={() => setGenerationError(null)}
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

export default App;