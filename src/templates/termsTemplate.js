export function generateTermsOfService(data) {
    return `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Termos de Uso - ${data.empresa}</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div id="modal-termos" class="modal-content">
      <h2>Termos e Condições</h2>
      <div class="modal-text">
        <p><strong>Bem-vindo(a) ao ${data.empresa}!</strong></p>
        <p>Estes termos e condições descrevem as regras e regulamentos para o uso do site da ${data.razaoSocial}, localizado em <a href="https://${data.dominio}" target="_blank">https://${data.dominio}</a>.</p><br>
        <p>Ao acessar este site, presumimos que você concorda com estes termos e condições. Não continue a usar o ${data.empresa} se você não concordar com todos os termos e condições declarados nesta página.</p>
        <br>
        <h3>Cookies</h3>
        <p>Este site utiliza cookies para ajudar a personalizar sua experiência online. Ao acessar o ${data.empresa}, você concorda com o uso dos cookies necessários.</p><br>
        <p>Um cookie é um arquivo de texto colocado em seu disco rígido por um servidor de páginas da web. Os cookies não podem ser usados para executar programas ou enviar vírus para o seu computador. Os cookies são atribuídos de forma exclusiva a você e só podem ser lidos por um servidor da web no domínio que emitiu o cookie para você.</p><br>
        
        <h3>Licença</h3>
        <p>Salvo disposição em contrário, a ${data.razaoSocial} e/ou seus licenciantes detêm os direitos de propriedade intelectual de todo o material presente no ${data.empresa}. Todos os direitos de propriedade intelectual são reservados. Você pode acessar o ${data.empresa} para seu uso pessoal, sujeito às restrições estabelecidas nestes termos e condições.</p>
        <p>Você não deve:</p><br>
        <ul>
          <li>Copiar ou republicar material do ${data.empresa};</li>
          <li>Vender, alugar ou sublicenciar material do ${data.empresa};</li>
          <li>Reproduzir, duplicar ou copiar material do ${data.empresa};</li>
          <li>Redistribuir conteúdo do ${data.empresa}.</li>
        </ul><br>
        
        <h3>Isenção de Responsabilidade</h3>
        <p>Na extensão máxima permitida pela lei aplicável, excluímos todas as representações, garantias e condições relacionadas ao nosso site e ao uso deste site.</p><br>
        <p>Desde que o site e as informações e serviços nele fornecidos sejam gratuitos, não seremos responsáveis por qualquer perda ou dano de qualquer natureza.</p>
        <br>
        <p><em>Última atualização: ${new Date().toLocaleDateString('pt-BR')}</em></p>
      </div>
    </div>
  </body>
  </html>`;
  }