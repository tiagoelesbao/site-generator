// Função para extrair o HTML, CSS e JS da resposta da API
export function extractFiles(response) {
  try {
    // Verificar se a resposta da API é válida
    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Resposta da API inválida');
    }

    const content = response.choices[0].message.content;
    
    // Padrão para extrair blocos de código
    const htmlRegex = /```html\s*([\s\S]*?)\s*```/;
    const cssRegex = /```css\s*([\s\S]*?)\s*```/;
    const jsRegex = /```javascript\s*([\s\S]*?)\s*```/;
    
    // Extrair o conteúdo de cada bloco
    const htmlMatch = content.match(htmlRegex);
    const cssMatch = content.match(cssRegex);
    const jsMatch = content.match(jsRegex);
    
    // Verificar se conseguimos extrair os blocos
    if (!htmlMatch || !cssMatch || !jsMatch) {
      console.warn('Não foi possível extrair um ou mais blocos de código da resposta.');
      
      // Gerar templates padrão para os blocos que faltam
      return {
        htmlContent: htmlMatch ? htmlMatch[1] : generateDefaultHTML(),
        cssContent: cssMatch ? cssMatch[1] : generateDefaultCSS(),
        jsContent: jsMatch ? jsMatch[1] : generateDefaultJS()
      };
    }
    
    return {
      htmlContent: htmlMatch[1],
      cssContent: cssMatch[1],
      jsContent: jsMatch[1]
    };
  } catch (error) {
    console.error('Erro ao extrair arquivos:', error);
    // Retornar conteúdo padrão em caso de erro
    return {
      htmlContent: generateDefaultHTML(),
      cssContent: generateDefaultCSS(),
      jsContent: generateDefaultJS()
    };
  }
}

// Funções para gerar conteúdo padrão
function generateDefaultHTML() {
  // Criar uma variável data para usar no template
  const currentDate = new Date();
  const data = {
    empresa: 'Empresa',
    razaoSocial: 'Razão Social',
    cnpj: '00.000.000/0001-00',
    endereco: 'Endereço da Empresa',
    email: 'contato@empresa.com',
    // outros valores padrão...
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Soluções personalizadas em marketing digital para o crescimento do seu negócio">
  <title>Marketing Digital</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div class="container header-container">
      <div class="logo">
        <a href="#" class="company-name">Company name</a>
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
        <h1>Soluções em marketing digital para o seu crescimento</h1>
        <p class="subtitle">Serviços personalizados para sua empresa</p>
      </div>
    </div>
  </section>

  <section id="servicos-cards" class="servicos-cards">
    <div class="container">
      <div class="cards-grid">
        <div class="service-card">
          <h3>Serviço 1</h3>
          <p>Descrição do serviço 1</p>
        </div>
        <div class="service-card">
          <h3>Serviço 2</h3>
          <p>Descrição do serviço 2</p>
        </div>
        <div class="service-card">
          <h3>Serviço 3</h3>
          <p>Descrição do serviço 3</p>
        </div>
      </div>
    </div>
  </section>

  <section id="quem-somos" class="quem-somos-section">
    <div class="container">
      <h2>Quem Somos</h2>
      <p class="company-info">Missão, visão, valores, informações sobre a empresa.</p>
      <p class="company-details">Companhia Exemplar Ltda<br>
      CNPJ 00.000.000/0001-00</p>
    </div>
  </section>

  <section id="servicos" class="servicos-section">
    <div class="container">
      <h2>Serviços</h2>
      <p class="services-intro">Oferecemos soluções completas em:</p>
      
      <ul class="services-list">
        <li><span class="checkmark">✓</span> Serviço 1</li>
        <li><span class="checkmark">✓</span> Serviço 2</li>
        <li><span class="checkmark">✓</span> Serviço 3</li>
      </ul>
    </div>
  </section>

  <section id="contato" class="contato-section">
    <div class="container contato-container">
      <div class="contato-info">
        <h2>Contato</h2>
        
        <div class="info-block">
          <h4>Endereço</h4>
          <p>Rua Exemplo 123, Cidade, Estado</p>
        </div>
        
        <div class="info-block">
          <h4>Telefone</h4>
          <p>(00) 0000-0000</p>
        </div>
        
        <div class="info-block">
          <h4>Email</h4>
          <p>contato@exemplo.com.br</p>
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
          <p class="footer-company-name">${data.empresa || 'Empresa'}: ${data.razaoSocial || 'Razão Social'}</p>
          <p class="footer-company-details">CNPJ ${data.cnpj || '00.000.000/0001-00'}</p>
          <p class="footer-address">${data.endereco || 'Endereço da Empresa'}</p>
          <p class="footer-copyright">© ${new Date().getFullYear()} ${data.empresa || 'Empresa'}. Todos os direitos reservados.</p>
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
</html>`;
}

function generateDefaultCSS() {
  // Gerar cores aleatórias para variação visual
  const hue = Math.floor(Math.random() * 360); // Valor entre 0 e 359
  const accentHue = (hue + 180) % 360; // Cor complementar para destaque
  
  // Variabilidade no layout
  const containerWidth = [1140, 1200, 1080, 1240][Math.floor(Math.random() * 4)];
  const borderRadius = [4, 6, 8, 12][Math.floor(Math.random() * 4)];
  const buttonStyle = ['rounded', 'pill', 'square'][Math.floor(Math.random() * 3)];
  const buttonBorderRadius = buttonStyle === 'rounded' ? '4px' : 
                           buttonStyle === 'pill' ? '20px' : '0';
  
  return `/* Base reset e estilos gerais */
  :root {
    --primary-color: hsl(${hue}, 70%, 40%);
    --accent-color: hsl(${accentHue}, 70%, 50%);
    --text-color: #333;
    --light-gray: #f5f5f5;
    --medium-gray: #e0e0e0;
    --white: #fff;
    --container-width: ${containerWidth}px;
    --border-radius: ${borderRadius}px;
    --transition: all 0.3s ease;
  }

    /* Restante do CSS com as variáveis */
  .submit-btn {
    /* ... propriedades existentes ... */
    border-radius: ${buttonBorderRadius};
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
  position: relative;
  /* Preparado para receber uma imagem de fundo */
  background-color: var(--light-gray);
}

.hero-content {
  max-width: 650px;
  position: relative;
  z-index: 2;
  padding: 2rem;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
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
}`;
}

function generateDefaultJS() {
  return `// Script para o site de marketing digital

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
});`;
}