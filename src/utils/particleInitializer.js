// src/utils/particleInitializer.js
// Função simplificada para criar efeito de partículas
export function createParticlesEffect() {
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
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 100 + 150)}, 255, ${Math.random() * 0.3 + 0.1})`,
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
            ctx.beginPath();
            ctx.strokeStyle = `rgba(130, 78, 226, ${(1 - distance/150) * 0.2})`;
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
  
  // Exportar função de inicialização para ser usada em App.js
  export function initParticles() {
    // Executar após um curto delay para garantir que o DOM esteja pronto
    setTimeout(createParticlesEffect, 500);
  }
  
  export default { createParticlesEffect, initParticles };