// src/utils/animations.js
export function initAnimations() {
    // Detectar elementos com a classe 'fade-in' e aplicar animações
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
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
    }, observerOptions);
    
    // Aplicar a todos os elementos com classe 'fade-in'
    document.querySelectorAll('.fade-in').forEach((el, index) => {
      el.dataset.delay = index;
      observer.observe(el);
    });
    
    // Efeito de partículas para o fundo (opcional)
    initParticles();
  }
  
  // Efeito de partículas para fundo mais tecnológico
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 100 + 150)}, 255, ${Math.random() * 0.5 + 0.2})`,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5
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
      
      // Conectar partículas próximas
      connectParticles();
      
      requestAnimationFrame(drawParticles);
    }
    
    function connectParticles() {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(130, 78, 226, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
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
  }