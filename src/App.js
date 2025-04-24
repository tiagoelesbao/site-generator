// src/App.js - Versão atualizada com animações e tema escuro
import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import DownloadButton from './components/DownloadButton';
import Logo from './components/Logo'; // Novo componente Logo
import './styles/main.css';
import './styles/dark-theme.css'; // Importar tema escuro

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
  
  // Inicializar animações e verificar token Netlify quando o componente for montado
  useEffect(() => {
    // Inicializar as animações
    initAnimations();
    
    // Verificar se há um token do Netlify no localStorage
    const storedToken = localStorage.getItem('netlify_token');
    if (!storedToken && process.env.NODE_ENV === 'development') {
      // Se não houver token e estiver em ambiente de desenvolvimento,
      // podemos avisá-lo mais tarde no processo de publicação
      console.info('Nenhum token Netlify encontrado para desenvolvimento');
    }
    
    // Limpar o estado de erro quando o usuário interage com o formulário
    if (generationError) {
      setGenerationError(null);
    }
  }, [formData, heroImage, generationError]);
  
  // Função para inicializar animações
  const initAnimations = () => {
    // Detectar elementos com a classe 'fade-in' e aplicar animações
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Inicializar observador de interseção
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Adicionar delay escalonado para animação em cascata
          if (entry.target.dataset.delay) {
            entry.target.style.transitionDelay = `${parseInt(entry.target.dataset.delay) * 0.1}s`;
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    // Aplicar a todos os elementos com classe 'fade-in'
    fadeElements.forEach((el, index) => {
      el.dataset.delay = index;
      observer.observe(el);
    });
    
    // Adicionar classes para animação de partículas no fundo
    const particlesCanvas = document.createElement('canvas');
    particlesCanvas.classList.add('particles-canvas');
    document.body.appendChild(particlesCanvas);
    
    // Inicializar efeito de partículas (em produção, você pode implementar isso em um arquivo separado)
    initParticlesEffect(particlesCanvas);
  };
  
  // Função para inicializar o efeito de partículas (simplificado)
  const initParticlesEffect = (canvas) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Configuração básica para partículas
    // Em produção, você implementaria um efeito completo
    ctx.fillStyle = 'rgba(130, 78, 226, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    // Ajustar tamanho do canvas ao redimensionar a janela
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
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
        <p>&copy; {new Date().getFullYear()} SiteGenAI - Gerador de Sites</p>
      </footer>
    </div>
  );
}

export default App;