export function generateTermsOfService(data) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Termos de Uso - Condições para uso dos nossos serviços">
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <title>Termos de Uso - ${data.empresa || 'Empresa'}</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    .terms-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    
    .terms-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .terms-header h1 {
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
    
    .terms-content h2 {
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    
    .terms-content p {
      margin-bottom: 1.25rem;
      line-height: 1.7;
    }
    
    .terms-content ul {
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
      list-style-type: disc;
    }
    
    .terms-content li {
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

  <div class="terms-container">
    <a href="index.html" class="backlink">Voltar para a página inicial</a>
    
    <div class="terms-header">
      <h1>Termos de Uso</h1>
      <p>Última atualização: Abril de 2025</p>
    </div>
    
    <div class="terms-content">
      <p>Bem-vindo aos Termos de Uso da ${data.razaoSocial || 'Empresa'}. Ao acessar e utilizar nosso site e serviços, você concorda com os termos e condições estabelecidos neste documento. Por favor, leia atentamente.</p>
      
      <h2>1. Aceitação dos Termos</h2>
      <p>Ao acessar ou utilizar nosso site, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, você está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos por leis de direitos autorais e marcas registradas.</p>
      
      <h2>2. Uso da Licença</h2>
      <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site da ${data.empresa || 'Empresa'}, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
      <ul>
        <li>Modificar ou copiar os materiais;</li>
        <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
        <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site da ${data.empresa || 'Empresa'};</li>
        <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
        <li>Transferir os materiais para outra pessoa ou "espelhar" os materiais em qualquer outro servidor.</li>
      </ul>
      <p>Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida pela ${data.empresa || 'Empresa'} a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso.</p>
      
      <h2>3. Isenção de Responsabilidade</h2>
      <p>Os materiais no site da ${data.empresa || 'Empresa'} são fornecidos "como estão". A ${data.empresa || 'Empresa'} não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>
      <p>Além disso, a ${data.empresa || 'Empresa'} não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</p>
      
      <h2>4. Limitações</h2>
      <p>Em nenhum caso a ${data.empresa || 'Empresa'} ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais no site da ${data.empresa || 'Empresa'}, mesmo que a ${data.empresa || 'Empresa'} ou um representante autorizado da ${data.empresa || 'Empresa'} tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a você.</p>
      
      <h2>5. Precisão dos Materiais</h2>
      <p>Os materiais exibidos no site da ${data.empresa || 'Empresa'} podem incluir erros técnicos, tipográficos ou fotográficos. A ${data.empresa || 'Empresa'} não garante que qualquer material em seu site seja preciso, completo ou atual. A ${data.empresa || 'Empresa'} pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, a ${data.empresa || 'Empresa'} não se compromete a atualizar os materiais.</p>
      
      <h2>6. Links</h2>
      <p>A ${data.empresa || 'Empresa'} não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por ${data.empresa || 'Empresa'} do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>
      
      <h2>7. Modificações</h2>
      <p>A ${data.empresa || 'Empresa'} pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
      
      <h2>8. Lei Aplicável</h2>
      <p>Estes termos e condições são regidos e interpretados de acordo com as leis do Brasil e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais neste estado.</p>
      
      <h2>9. Contato</h2>
      <p>Se você tiver dúvidas ou preocupações sobre estes Termos de Uso, entre em contato conosco:</p>
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