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
    
    // Conteúdo padrão caso não encontre os blocos correspondentes
    const htmlContent = htmlMatch ? htmlMatch[1] : generateDefaultHTML();
    const cssContent = cssMatch ? cssMatch[1] : generateDefaultCSS();
    const jsContent = jsMatch ? jsMatch[1] : generateDefaultJS();
    
    return { htmlContent, cssContent, jsContent };
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
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Gerado</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="logo">
        <h1>Nome da Empresa</h1>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#quem-somos">Quem Somos</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <h2>Título Principal</h2>
      <p>Subtítulo ou descrição do seu negócio</p>
      <a href="#contato" class="btn">Entre em Contato</a>
    </div>
  </section>

  <section id="servicos" class="services">
    <div class="container">
      <h2>Nossos Serviços</h2>
      <div class="services-grid">
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

  <section id="quem-somos" class="about">
    <div class="container">
      <h2>Quem Somos</h2>
      <p>Texto institucional sobre a empresa.</p>
    </div>
  </section>

  <section id="contato" class="contact">
    <div class="container">
      <h2>Entre em Contato</h2>
      <div class="contact-info">
        <p>Email: contato@empresa.com</p>
        <p>Telefone: (00) 0000-0000</p>
        <p>Endereço: Rua Exemplo, 123 - Cidade/UF</p>
      </div>
      <form class="contact-form">
        <input type="text" placeholder="Nome" required>
        <input type="email" placeholder="Email" required>
        <textarea placeholder="Mensagem" required></textarea>
        <button type="submit" class="btn">Enviar</button>
      </form>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2025 Nome da Empresa. Todos os direitos reservados.</p>
      <div class="footer-links">
        <a href="politica-privacidade.html">Política de Privacidade</a>
        <a href="termos-uso.html">Termos de Uso</a>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
}

function generateDefaultCSS() {
  return `/* Reset e estilos gerais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

section {
  padding: 80px 0;
}

h1, h2, h3 {
  margin-bottom: 20px;
}

a {
  text-decoration: none;
  color: #333;
}

.btn {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #45a049;
}

/* Header */
.site-header {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.site-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo h1 {
  font-size: 24px;
  margin: 0;
}

.main-nav ul {
  display: flex;
  list-style: none;
}

.main-nav li {
  margin-left: 20px;
}

.main-nav a {
  padding: 10px;
  transition: color 0.3s;
}

.main-nav a:hover {
  color: #4CAF50;
}

/* Hero Section */
.hero {
  background-color: #f8f9fa;
  text-align: center;
  padding: 120px 0;
}

.hero h2 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Services Section */
.services {
  background-color: white;
  text-align: center;
}

.services h2 {
  margin-bottom: 50px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.service-card {
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* About Section */
.about {
  background-color: #f8f9fa;
  text-align: center;
}

.about p {
  max-width: 800px;
  margin: 0 auto;
}

/* Contact Section */
.contact {
  background-color: white;
  text-align: center;
}

.contact-info {
  margin-bottom: 30px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
}

.contact-form input,
.contact-form textarea {
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.contact-form textarea {
  height: 150px;
  resize: vertical;
}

/* Footer */
.site-footer {
  background-color: #333;
  color: white;
  padding: 30px 0;
  text-align: center;
}

.site-footer a {
  color: white;
  margin: 0 10px;
}

.footer-links {
  margin-top: 20px;
}

/* Responsividade */
@media (max-width: 768px) {
  .site-header .container {
    flex-direction: column;
  }
  
  .main-nav {
    margin-top: 20px;
  }
  
  .main-nav ul {
    flex-direction: column;
    text-align: center;
  }
  
  .main-nav li {
    margin: 10px 0;
  }
  
  .hero h2 {
    font-size: 36px;
  }
  
  .hero p {
    font-size: 18px;
  }
  
  section {
    padding: 60px 0;
  }
}`;
}

function generateDefaultJS() {
  return `// Menu responsivo
document.addEventListener('DOMContentLoaded', function() {
  // Animações de scroll suave para os links internos
  const links = document.querySelectorAll('a[href^="#"]');
  
  for (const link of links) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Validação simples do formulário
  const form = document.querySelector('.contact-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      form.reset();
    });
  }
  
  // Adiciona classe ativa ao menu quando o usuário faz scroll
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
});

// Adiciona efeitos de animação aos elementos quando eles entram na viewport
function animateOnScroll() {
  const elements = document.querySelectorAll('.service-card, .about p, .contact-form');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;
    
    if (elementPosition < screenPosition) {
      element.classList.add('animated');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Executa também no carregamento da página`;
}