export function generatePrivacyPolicy(data) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Política de Privacidade - Como tratamos seus dados">
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <title>Política de Privacidade - ${data.empresa || 'Empresa'}</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    .policy-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    
    .policy-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .policy-header h1 {
      margin-bottom: 1rem;
    }
    
    .backlink {
      display: inline-flex;
      align-items: center;
      margin-bottom: 2rem;
      font-weight: 500;
    }
    
    .backlink::before {
      content: '←';
      margin-right: 0.5rem;
    }
    
    .backlink:hover {
      color: #0066ff;
    }
    
    .policy-content h2 {
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    
    .policy-content p {
      margin-bottom: 1.25rem;
      line-height: 1.7;
    }
    
    .policy-content ul {
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
      list-style-type: disc;
    }
    
    .policy-content li {
      margin-bottom: 0.75rem;
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container header-container">
      <div class="logo">
        <a href="index.html" class="company-name">${data.empresa || 'Empresa'}</a>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="index.html#quem-somos">Quem Somos</a></li>
          <li><a href="index.html#servicos">Serviços</a></li>
          <li><a href="index.html#contato">Contato</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="policy-container">
    <a href="index.html" class="backlink">Voltar para a página inicial</a>
    
    <div class="policy-header">
      <h1>Política de Privacidade</h1>
      <p>Última atualização: Abril de 2025</p>
    </div>
    
    <div class="policy-content">
      <p>A ${data.razaoSocial || 'Empresa'} ("nós", "nosso" ou "empresa") está comprometida com a proteção da sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos as suas informações pessoais quando você utiliza nosso site e serviços.</p>
      
      <h2>1. Informações que coletamos</h2>
      <p>Podemos coletar os seguintes tipos de informações:</p>
      <ul>
        <li><strong>Informações pessoais identificáveis</strong>: como nome, endereço de e-mail, número de telefone e endereço postal, que você fornece voluntariamente ao utilizar nossos serviços ou entrar em contato conosco.</li>
        <li><strong>Informações não pessoais</strong>: como dados do navegador, tipo de dispositivo, preferências, atividades no site e informações técnicas sobre sua conexão com nosso site.</li>
      </ul>
      
      <h2>2. Como usamos suas informações</h2>
      <p>Utilizamos as informações coletadas para os seguintes fins:</p>
      <ul>
        <li>Fornecer, operar e manter nossos serviços;</li>
        <li>Melhorar, personalizar e expandir nossos serviços;</li>
        <li>Entender e analisar como você utiliza nossos serviços;</li>
        <li>Desenvolver novos produtos, serviços, recursos e funcionalidades;</li>
        <li>Comunicar com você diretamente ou através de um de nossos parceiros para fornecer atualizações, informações relacionadas aos serviços, e para fins de marketing e promocionais;</li>
        <li>Processar suas transações;</li>
        <li>Prevenir e resolver problemas técnicos ou de segurança.</li>
      </ul>
      
      <h2>3. Compartilhamento de informações</h2>
      <p>Não vendemos, comercializamos ou transferimos suas informações pessoais identificáveis para terceiros, exceto nas seguintes circunstâncias:</p>
      <ul>
        <li>Para fornecedores, consultores e outros prestadores de serviços que necessitam ter acesso a tais informações para realizar trabalhos em nosso nome;</li>
        <li>Para cumprir com a lei, regulamentos ou solicitações legais;</li>
        <li>Para proteger nossos direitos, propriedade ou segurança, e os de nossos clientes;</li>
        <li>Com seu consentimento ou de acordo com suas instruções.</li>
      </ul>
      
      <h2>4. Segurança dos dados</h2>
      <p>Implementamos medidas de segurança apropriadas para proteger contra acesso não autorizado, alteração, divulgação ou destruição de suas informações pessoais. No entanto, nenhum método de transmissão pela internet ou método de armazenamento eletrônico é 100% seguro, e não podemos garantir sua segurança absoluta.</p>
      
      <h2>5. Seus direitos</h2>
      <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de acessar, retificar, cancelar e se opor ao processamento de seus dados pessoais. Você também pode limitar o processamento de suas informações e solicitar a portabilidade de seus dados.</p>
      
      <h2>6. Alterações a esta Política</h2>
      <p>Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e, se as alterações forem significativas, enviaremos uma notificação por e-mail.</p>
      
      <h2>7. Contato</h2>
      <p>Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre o tratamento de seus dados, entre em contato conosco:</p>
      <p>
        ${data.razaoSocial || 'Empresa'}<br>
        CNPJ: ${data.cnpj || '00.000.000/0001-00'}<br>
        Endereço: ${data.endereco || 'Endereço da Empresa'}<br>
        E-mail: ${data.email || 'contato@empresa.com'}<br>
        Telefone: ${data.telefone || '(00) 0000-0000'}
      </p>
    </div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-company">
          <p class="footer-company-name">${data.empresa || 'Empresa'}: ${data.razaoSocial || 'Razão Social'}</p>
          <p class="footer-company-details">CNPJ ${data.cnpj || '00.000.000/0001-00'}</p>
          <p class="footer-address">${data.endereco || 'Endereço da Empresa'}</p>
        </div>
        
        <div class="footer-links">
          <a href="politica-privacidade.html" class="policy-link">Política de Privacidade</a>
          <a href="termos-uso.html" class="policy-link">Termo de uso</a>
        </div>
      </div>
    </div>
  </footer>

</body>
</html>`;
}