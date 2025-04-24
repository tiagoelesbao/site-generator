import { siteTemplates } from '../templates/siteTemplates';

export async function generateSite(formData, templateId = null) {
  // Selecionar template específico ou escolher aleatoriamente
  let selectedTemplate;
  
  if (templateId && siteTemplates.find(t => t.id === templateId)) {
    selectedTemplate = siteTemplates.find(t => t.id === templateId);
  } else {
    const randomTemplateIndex = Math.floor(Math.random() * siteTemplates.length);
    selectedTemplate = siteTemplates[randomTemplateIndex];
  }
  
  // Funções auxiliares para gerar blocos específicos
  const generateFooter = () => {
    const currentYear = new Date().getFullYear();
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-company">
            <p class="footer-company-name">${formData.empresa || 'Empresa'}</p>
            <p class="footer-company-details">${formData.razaoSocial || 'Razão Social'} - CNPJ: ${formData.cnpj || '00.000.000/0001-00'}</p>
            <p class="footer-address">${formData.endereco || 'Endereço da Empresa'}</p>
            <p class="footer-contact">Email: ${formData.email || 'contato@empresa.com'} | Tel: ${formData.telefone || '(00) 0000-0000'}</p>
            <p class="footer-copyright">© ${currentYear} ${formData.empresa || 'Empresa'}. Todos os direitos reservados.</p>
          </div>
          
          <div class="footer-links">
            <a href="politica-privacidade.html" class="policy-link">Política de Privacidade</a>
            <a href="termos-uso.html" class="policy-link">Termo de uso</a>
          </div>
        </div>
      </div>
    </footer>`;
  };
  
  const generateQuemSomos = () => {
    return `
    <section id="quem-somos" class="quem-somos-section">
      <div class="container">
        <h2>Quem Somos</h2>
        <div class="quem-somos-content">
          <p class="company-info">${formData.quemSomos || 'Texto institucional sobre a empresa.'}</p>
        </div>
      </div>
    </section>`;
  };

  // Variáveis de estilo com base no template selecionado
  const styleVars = {
    primaryColor: selectedTemplate.colors[0] || '#333333',
    backgroundColor: selectedTemplate.colors[1] || '#ffffff',
    lightGray: selectedTemplate.colors[2] || '#f5f5f5',
    accentColor: selectedTemplate.colors[3] || '#4CAF50',
    secondaryColor: selectedTemplate.colors[4] || selectedTemplate.colors[3] || '#1976D2',
    headingFont: selectedTemplate.fonts.heading || "'Montserrat', sans-serif",
    bodyFont: selectedTemplate.fonts.body || "'Inter', sans-serif",
    animations: (selectedTemplate.animations || ['fade', 'slide']).join(', '),
    layout: selectedTemplate.layout || 'wide',
    heroStyle: selectedTemplate.heroStyle || 'centered'
  };

  // Construção do prompt para OpenAI, incluindo detalhes do template selecionado
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
    - Design: ${selectedTemplate.name || 'Moderno e Minimalista'}
    - Espaçamento amplo entre elementos
    - Tipografia: ${styleVars.headingFont} para títulos, ${styleVars.bodyFont} para o corpo do texto
    - Esquema de cores: 
      * Cor primária (textos e elementos principais): ${styleVars.primaryColor}
      * Cor de fundo: ${styleVars.backgroundColor}
      * Cor cinza claro (para cards e seções): ${styleVars.lightGray}
      * Cor de destaque principal: ${styleVars.accentColor}
      * Cor de destaque secundária: ${styleVars.secondaryColor}
    - Layout: ${styleVars.layout === 'wide' ? 'layout amplo e moderno' : 'layout mais compacto e boxed'}
    - Estilo hero: ${styleVars.heroStyle}
    - Cards para serviços com fundo cinza claro
    - Lista de serviços com checkmarks
    - Layout de duas colunas na seção de contato (formulário e informações)
    - Navegação fixa no topo
    - Seção hero preparada para receber uma imagem de fundo
    - Animações suaves: ${styleVars.animations}
    - Footer completo com todas as informações de contato e copyright

    REQUISITOS:
    - Gere o código HTML completo para a página inicial dentro de um bloco de código com a sintaxe \`\`\`html
    - Gere o código CSS completo dentro de um bloco de código com a sintaxe \`\`\`css
    - Gere o código JavaScript completo dentro de um bloco de código com a sintaxe \`\`\`javascript
    - Inclua fontes do Google Fonts
    - Garanta responsividade para todos dispositivos
    - Formulário de contato funcional
    - Navegação suave para links internos
    - Prepare o CSS para receber uma imagem de fundo na seção hero
    - NÃO inclua nenhum favicon ou link para favicon externo no HTML
    - O footer DEVE incluir:
      * Nome da empresa + razão social
      * CNPJ completo
      * Endereço completo
      * Email e telefone de contato
      * Copyright com ano atual
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
            content: "Você é um desenvolvedor web especializado em criar sites modernos, minimalistas e responsivos para marketing digital, seguindo as tendências mais recentes de design. Seu foco é em um design clean, corporativo e profissional. NÃO inclua favicons ou referências a favicons ou outros ícones externos no código HTML. Certifique-se de incluir um rodapé completo com todas as informações de contato e direitos autorais. Lembre-se de manter as informações sensíveis da empresa discretas e evite expor desnecessariamente dados como CNPJ na seção principal 'Quem Somos'."
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
    
    // Retornar uma resposta fallback com template melhorado
    const currentYear = new Date().getFullYear();
    
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
  <title>${formData.empresa || 'Empresa'} - Marketing Digital</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${styleVars.headingFont.replace(/'/g, '').replace(/,.+/g, '')}&family=${styleVars.bodyFont.replace(/'/g, '').replace(/,.+/g, '')}&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Cabeçalho com navegação -->
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

  <!-- Seção Hero principal -->
  <section id="hero" class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1>${formData.tituloHero || 'Soluções em marketing digital para o seu crescimento'}</h1>
        <p class="subtitle">${formData.subtituloHero || 'Serviços personalizados para sua empresa'}</p>
      </div>
    </div>
  </section>

  <!-- Cards de serviços -->
  <section id="servicos-cards" class="servicos-cards">
    <div class="container">
      <h2>Nossos Serviços</h2>
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

  <!-- Quem Somos - Versão discreto sem informações sensíveis -->
  <section id="quem-somos" class="quem-somos-section">
    <div class="container">
      <h2>Quem Somos</h2>
      <div class="quem-somos-content">
        <p class="company-info">${formData.quemSomos || 'Texto institucional sobre a empresa.'}</p>
      </div>
    </div>
  </section>

  <!-- Lista de serviços com checkmarks -->
  <section id="servicos" class="servicos-section">
    <div class="container">
      <h2>Nossos Diferenciais</h2>
      <p class="services-intro">Oferecemos soluções completas em:</p>
      
      <ul class="services-list">
        <li><span class="checkmark">✓</span> ${formData.servico1Nome || 'Serviço 1'}</li>
        <li><span class="checkmark">✓</span> ${formData.servico2Nome || 'Serviço 2'}</li>
        <li><span class="checkmark">✓</span> ${formData.servico3Nome || 'Serviço 3'}</li>
      </ul>
    </div>
  </section>

  <!-- Seção de contato com duas colunas -->
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

  <!-- Rodapé completo com todas as informações -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-company">
          <p class="footer-company-name">${formData.empresa || 'Empresa'}</p>
          <p class="footer-company-details">${formData.razaoSocial || 'Razão Social'} - CNPJ: ${formData.cnpj || '00.000.000/0001-00'}</p>
          <p class="footer-address">${formData.endereco || 'Endereço da Empresa'}</p>
          <p class="footer-contact">Email: ${formData.email || 'contato@empresa.com'} | Tel: ${formData.telefone || '(00) 0000-0000'}</p>
          <p class="footer-copyright">© ${currentYear} ${formData.empresa || 'Empresa'}. Todos os direitos reservados.</p>
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
  --primary-color: ${styleVars.primaryColor};
  --text-color: ${styleVars.primaryColor};
  --background-color: ${styleVars.backgroundColor};
  --light-gray: ${styleVars.lightGray};
  --medium-gray: #e0e0e0;
  --accent-color: ${styleVars.accentColor};
  --secondary-color: ${styleVars.secondaryColor};
  --container-width: ${styleVars.layout === 'wide' ? '1200px' : '1000px'};
  --transition: all 0.3s ease;
  --box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  --border-radius: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: ${styleVars.bodyFont};
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
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
  font-family: ${styleVars.headingFont};
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

h2::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 50px;
  height: 3px;
  background-color: var(--accent-color);
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
  background-color: var(--background-color);
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
  background-color: var(--light-gray);
  position: relative;
  /* Preparado para receber uma imagem de fundo */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero-content {
  max-width: 650px;
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.hero-content h1 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-color);
}

/* Serviços Cards */
.servicos-cards {
  padding: 5rem 0;
  background-color: var(--background-color);
  text-align: center;
}

.servicos-cards h2 {
  margin-bottom: 2rem;
  display: inline-block;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.service-card {
  background-color: var(--light-gray);
  padding: 2rem;
  border-radius: var(--border-radius);
  height: 100%;
  transition: var(--transition);
  text-align: left;
  box-shadow: var(--box-shadow);
  border-top: 3px solid var(--accent-color);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.service-card h3 {
  color: var(--primary-color);
  position: relative;
  margin-bottom: 1.25rem;
}

.service-card p {
  color: var(--text-color);
}

/* Quem Somos */
.quem-somos-section {
  padding: 6rem 0;
  background-color: var(--background-color);
}

.quem-somos-section h2 {
  margin-bottom: 2rem;
}

.quem-somos-content {
  max-width: 800px;
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
  max-width: 600px;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 600px;
}

.services-list li {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  background-color: var(--background-color);
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.checkmark {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  margin-right: 0.75rem;
  color: white;
  background-color: var(--accent-color);
  border-radius: 50%;
  font-weight: bold;
}

/* Contato Section */
.contato-section {
  padding: 6rem 0;
  background-color: var(--background-color);
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
  padding: 1.5rem;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.info-block h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--accent-color);
}

.contato-form form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
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
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.2);
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.submit-btn {
  display: inline-block;
  background-color: var(--accent-color);
  color: white;
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
  background-color: var(--secondary-color);
}

/* Footer */
.site-footer {
  background-color: var(--primary-color);
  color: white;
  padding: 4rem 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-company {
  flex-basis: 60%;
}

.footer-company-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.footer-company-details,
.footer-address,
.footer-contact {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.footer-copyright {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.7;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.policy-link {
  color: white;
  text-decoration: none;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  opacity: 0.9;
}

.policy-link::after {
  content: '↗';
  margin-left: 0.25rem;
  font-size: 0.9rem;
}

.policy-link:hover {
  opacity: 1;
  transform: translateX(5px);
}

/* Animações */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.service-card, .info-block, .quem-somos-content {
  animation: fadeIn 0.8s ease forwards;
}

/* Responsividade */
@media (max-width: 1024px) {
  :root {
    --container-width: 95%;
  }
  
  h1 {
    font-size: 2.25rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
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
  
  .footer-company {
    flex-basis: 100%;
  }
  
  .footer-links {
    flex-direction: row;
    gap: 2rem;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.75rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .hero-section {
    padding: 5rem 0 4rem;
  }
  
  .hero-content {
    padding: 1.5rem;
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
  
  .service-card {
    padding: 1.5rem;
  }
  
  .info-block {
    padding: 1rem;
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
      
      // Validar formulário
      let isValid = true;
      const errorMessages = [];
      
      if (!formData.nome.trim()) {
        isValid = false;
        errorMessages.push('Nome é obrigatório');
      }
      
      if (!formData.email.trim()) {
        isValid = false;
        errorMessages.push('Email é obrigatório');
      } else if (!isValidEmail(formData.email)) {
        isValid = false;
        errorMessages.push('Digite um email válido');
      }
      
      if (!formData.mensagem.trim()) {
        isValid = false;
        errorMessages.push('Mensagem é obrigatória');
      }
      
      // Se houver erros, mostrar mensagens
      if (!isValid) {
        alert('Por favor, corrija os seguintes erros:\\n' + errorMessages.join('\\n'));
        return;
      }
      
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
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        successMessage.style.backgroundColor = '#e8f5e9';
        successMessage.style.color = '#2e7d32';
        successMessage.style.padding = '1rem';
        successMessage.style.borderRadius = '4px';
        successMessage.style.marginTop = '1rem';
        
        contactForm.appendChild(successMessage);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }, 1500);
    });
  }
  
  // Função para validar email
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
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
  
  // Animação para elementos entrando na viewport
  function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .quem-somos-content, .services-list li, .info-block, .contato-form');
    
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
  const animatedElements = document.querySelectorAll('.service-card, .quem-somos-content, .services-list li, .info-block, .contato-form');
  
  animatedElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    // Adicionar delay escalonado para animação em cascata
    element.style.transitionDelay = (index * 0.1) + 's';
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