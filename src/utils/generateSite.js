export async function generateSite(formData) {
  // Construção do prompt para OpenAI
  const prompt = `
    Gere um site responsivo completo para marketing digital baseado nas seguintes informações:
    
    DADOS DA EMPRESA:
    - Nome: ${formData.empresa || 'Empresa'}
    - Razão Social: ${formData.razaoSocial || 'Razão Social'}
    - CNPJ: ${formData.cnpj || '00.000.000/0001-00'}
    - Endereço: ${formData.endereco || 'Endereço da Empresa'}
    - Email: ${formData.email || 'contato@empresa.com'}
    - Email LGPD: ${formData.emailLGPD || 'lgpd@empresa.com'}
    - Telefone: ${formData.telefone || '(00) 0000-0000'}
    - Domínio: ${formData.dominio || 'empresa.com.br'}
    
    SEÇÃO HERO:
    - Título Principal: ${formData.tituloHero || 'Soluções em marketing digital para o seu crescimento'}
    - Subtítulo: ${formData.subtituloHero || 'Serviços personalizados para sua empresa'}
    
    SERVIÇOS:
    - Serviço 1: ${formData.servico1Nome || 'Serviço 1'} - ${formData.servico1Desc || 'Descrição do serviço 1.'}
    - Serviço 2: ${formData.servico2Nome || 'Serviço 2'} - ${formData.servico2Desc || 'Descrição do serviço 2.'}
    - Serviço 3: ${formData.servico3Nome || 'Serviço 3'} - ${formData.servico3Desc || 'Descrição do serviço 3.'}
    
    QUEM SOMOS:
    ${formData.quemSomos || 'Texto institucional sobre a empresa.'}
    
    ESTILO VISUAL:
    - Design minimalista e profissional
    - Espaçamento amplo entre elementos
    - Tipografia moderna (use a fonte Inter do Google Fonts)
    - Esquema de cores clean e corporativo (preto, branco, cinza)
    - Cores de destaque sutis (azul como cor de destaque)
    - Cards para serviços com fundo cinza claro
    - Lista de serviços com checkmarks
    - Informações de contato e CNPJ visíveis no rodapé
    - Layout de duas colunas na seção de contato (formulário e informações)
    - Navegação fixa no topo
    
    REQUISITOS:
    - Gere o código HTML completo para a página inicial dentro de um bloco de código com a sintaxe \`\`\`html
    - Gere o código CSS completo dentro de um bloco de código com a sintaxe \`\`\`css
    - Gere o código JavaScript completo dentro de um bloco de código com a sintaxe \`\`\`javascript
    - Inclua a fonte Inter do Google Fonts
    - Garanta responsividade para todos dispositivos
    - Formulário de contato funcional
    - Navegação suave para links internos
    - Informações de rodapé seguindo o modelo exato abaixo:
      * Nome da empresa + Ltda.
      * CNPJ completo
      * Endereço completo
      * Links para política de privacidade e termos de uso
    - O código precisa estar bem comentado e organizado
  `;
  
  try {
    // Verificar se a chave da API existe
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('sua-chave-aqui') || apiKey.includes('=sua-chave-aqui')) {
      console.warn('Chave da API OpenAI não configurada ou inválida. Usando geração local.');
      throw new Error('Chave API inválida');
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um desenvolvedor web especializado em criar sites modernos, minimalistas e responsivos para marketing digital, seguindo as tendências mais recentes de design. Seu foco é em um design clean, corporativo e profissional."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        timeout: 120000 // Aumentar timeout para 2 minutos
      })
    });
    
    // Verificar se a resposta está ok
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(`Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro ao gerar site:", error);
    
    // Retornar uma resposta fallback baseada no modelo de design minimalista
    return {
      choices: [
        {
          message: {
            content: `
\`\`\`html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Soluções personalizadas em marketing digital para o crescimento do seu negócio">
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <title>${formData.empresa || 'Empresa'} - Marketing Digital</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div class="container header-container">
      <div class="logo">
        <a href="#" class="company-name">${formData.empresa || 'Empresa'}</a>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#quem-somos">Quem Somos</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section id="hero" class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1>${formData.tituloHero || 'Soluções em marketing digital para o seu crescimento'}</h1>
        <p class="subtitle">${formData.subtituloHero || 'Serviços personalizados para sua empresa'}</p>
      </div>
    </div>
  </section>

  <section id="servicos-cards" class="servicos-cards">
    <div class="container">
      <div class="cards-grid">
        <div class="service-card">
          <h3>${formData.servico1Nome || 'Serviço 1'}</h3>
          <p>${formData.servico1Desc || 'Descrição do serviço 1'}</p>
        </div>
        <div class="service-card">
          <h3>${formData.servico2Nome || 'Serviço 2'}</h3>
          <p>${formData.servico2Desc || 'Descrição do serviço 2'}</p>
        </div>
        <div class="service-card">
          <h3>${formData.servico3Nome || 'Serviço 3'}</h3>
          <p>${formData.servico3Desc || 'Descrição do serviço 3'}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="quem-somos" class="quem-somos-section">
    <div class="container">
      <h2>Quem Somos</h2>
      <p class="company-info">${formData.quemSomos || 'Texto institucional sobre a empresa.'}</p>
      <p class="company-details">${formData.razaoSocial || 'Razão Social'}<br>
      CNPJ ${formData.cnpj || '00.000.000/0001-00'}</p>
    </div>
  </section>

  <section id="servicos" class="servicos-section">
    <div class="container">
      <h2>Serviços</h2>
      <p class="services-intro">Oferecemos soluções completas em:</p>
      
      <ul class="services-list">
        <li><span class="checkmark">✓</span> ${formData.servico1Nome || 'Serviço 1'}</li>
        <li><span class="checkmark">✓</span> ${formData.servico2Nome || 'Serviço 2'}</li>
        <li><span class="checkmark">✓</span> ${formData.servico3Nome || 'Serviço 3'}</li>
      </ul>
    </div>
  </section>

  <section id="contato" class="contato-section">
    <div class="container contato-container">
      <div class="contato-info">
        <h2>Contato</h2>
        
        <div class="info-block">
          <h4>Endereço</h4>
          <p>${formData.endereco || 'Endereço da Empresa'}</p>
        </div>
        
        <div class="info-block">
          <h4>Telefone</h4>
          <p>${formData.telefone || '(00) 0000-0000'}</p>
        </div>
        
        <div class="info-block">
          <h4>Email</h4>
          <p>${formData.email || 'contato@empresa.com'}</p>
        </div>
      </div>
      
      <div class="contato-form">
        <form id="contact-form">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome" required>
          </div>
          
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="mensagem">Mensagem</label>
            <textarea id="mensagem" name="mensagem" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Enviar</button>
        </form>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-company">
          <p class="footer-company-name">${formData.empresa || 'Empresa'}: ${formData.razaoSocial || 'Razão Social'}</p>
          <p class="footer-company-details">CNPJ ${formData.cnpj || '00.000.000/0001-00'}</p>
          <p class="footer-address">${formData.endereco || 'Endereço da Empresa'}</p>
        </div>
        
        <div class="footer-links">
          <a href="politica-privacidade.html" class="policy-link">Política de Privacidade</a>
          <a href="termos-uso.html" class="policy-link">Termo de uso</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
\`\`\`

\`\`\`css
/* Base reset e estilos gerais */
:root {
  --primary-color: #000;
  --text-color: #333;
  --light-gray: #f5f5f5;
  --medium-gray: #e0e0e0;
  --accent-color: #0066ff;
  --white: #fff;
  --container-width: 1140px;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--white);
  padding: 0;
  overflow-x: hidden;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

a {
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
}

ul {
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

p {
  margin-bottom: 1rem;
}

section {
  padding: 5rem 0;
}

/* Header */
.site-header {
  background-color: var(--white);
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.company-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.main-nav ul {
  display: flex;
  gap: 2rem;
}

.main-nav a {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
  transition: var(--transition);
  position: relative;
}

.main-nav a:hover,
.main-nav a.active {
  color: var(--accent-color);
}

.main-nav a::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: var(--accent-color);
  transition: var(--transition);
}

.main-nav a:hover::after,
.main-nav a.active::after {
  width: 100%;
}

/* Hero Section */
.hero-section {
  padding: 7rem 0 6rem;
  background-color: var(--white);
}

.hero-content {
  max-width: 650px;
}

.hero-content h1 {
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-color);
}

/* Serviços Cards */
.servicos-cards {
  padding: 5rem 0;
  background-color: var(--white);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.service-card {
  background-color: var(--light-gray);
  padding: 2rem;
  border-radius: 4px;
  height: 100%;
  transition: var(--transition);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* Quem Somos */
.quem-somos-section {
  padding: 6rem 0;
  background-color: var(--white);
}

.quem-somos-section h2 {
  margin-bottom: 2rem;
}

.company-info, 
.company-details {
  max-width: 650px;
}

.company-details {
  margin-top: 1rem;
}

/* Serviços Section */
.servicos-section {
  padding: 6rem 0;
  background-color: var(--light-gray);
}

.servicos-section h2 {
  margin-bottom: 1.5rem;
}

.services-intro {
  margin-bottom: 2.5rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.services-list li {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
}

.checkmark {
  display: inline-flex;
  margin-right: 0.75rem;
  color: var(--accent-color);
  font-weight: bold;
}

/* Contato Section */
.contato-section {
  padding: 6rem 0;
  background-color: var(--white);
}

.contato-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contato-info h2 {
  margin-bottom: 2.5rem;
}

.info-block {
  margin-bottom: 2rem;
}

.info-block h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contato-form form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 1rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.submit-btn {
  display: inline-block;
  background-color: var(--accent-color);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
}

.submit-btn:hover {
  background-color: #0055cc;
}

/* Footer */
.site-footer {
  background-color: var(--white);
  padding: 4rem 0;
  border-top: 1px solid var(--medium-gray);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.footer-company-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.footer-company-details {
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.policy-link {
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
}

.policy-link::after {
  content: '↗';
  margin-left: 0.25rem;
  font-size: 0.9rem;
}

.policy-link:hover {
  color: var(--accent-color);
}

/* Responsividade */
@media (max-width: 1024px) {
  :root {
    --container-width: 960px;
  }
  
  h1 {
    font-size: 2.25rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
  :root {
    --container-width: 720px;
  }
  
  section {
    padding: 4rem 0;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .contato-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .site-header {
    position: relative;
  }
  
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-nav ul {
    gap: 1.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-links {
    flex-direction: row;
    gap: 2rem;
  }
}

@media (max-width: 576px) {
  :root {
    --container-width: 100%;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .hero-section {
    padding: 5rem 0 4rem;
  }
  
  .main-nav ul {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem 1.5rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
}
\`\`\`

\`\`\`javascript
// Script para o site de marketing digital

document.addEventListener('DOMContentLoaded', function() {
  // Navegação suave para links internos
  const links = document.querySelectorAll('a[href^="#"]');
  
  for (const link of links) {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calcular a posição com um pequeno offset para o header fixo
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Atualizar URL sem recarregar a página
        history.pushState(null, null, targetId);
      }
    });
  }
  
  // Formulário de contato
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obter valores do formulário
      const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        mensagem: document.getElementById('mensagem').value
      };
      
      // Aqui você adicionaria o código para enviar os dados para seu backend
      // Por enquanto, apenas simulamos o envio com um feedback visual
      
      // Desabilitar o botão durante o "envio"
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
      
      // Simular envio com um timeout
      setTimeout(() => {
        // Resetar formulário
        contactForm.reset();
        
        // Restaurar botão
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Mostrar mensagem de sucesso
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      }, 1500);
    });
  }
  
  // Detectar seção ativa durante o scroll
  function setActiveNavItem() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = '#' + section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      }
      
      // Se estivermos no topo da página, destaque o link Home
      if (window.scrollY < 100 && link.getAttribute('href') === '#') {
        link.classList.add('active');
      }
    });
  }
  
  // Executar ao carregar e durante o scroll
  setActiveNavItem();
  window.addEventListener('scroll', setActiveNavItem);
  
  // Animação sutil para elementos entrando na viewport
  function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .company-info, .services-list, .contato-info, .contato-form');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight - 100;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Adicionar estilo inicial para os elementos que serão animados
  const animatedElements = document.querySelectorAll('.service-card, .company-info, .services-list, .contato-info, .contato-form');
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Executar ao carregar e durante o scroll
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);
});
\`\`\`
            `
          }
        }
      ]
    };
  }
}