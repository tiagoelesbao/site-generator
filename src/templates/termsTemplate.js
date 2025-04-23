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
    <h2>Termos de Uso</h2>
    <div class="modal-text">
      <p>Bem-vindo aos Termos de Uso do site ${data.dominio}, de propriedade da ${data.razaoSocial}.</p><br>
      <p>Ao acessar este site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p><br>
      
      <h3>1. Uso de Licença</h3>
      <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site ${data.dominio}, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
      <ul>
        <li>modificar ou copiar os materiais;</li>
        <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
        <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site ${data.dominio};</li>
        <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
        <li>transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor.</li>
      </ul>
      <p>Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por ${data.empresa} a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso.</p><br>
      
      <h3>2. Isenção de responsabilidade</h3>
      <p>Os materiais no site da ${data.empresa} são fornecidos 'como estão'. ${data.empresa} não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>
      <p>Além disso, o ${data.empresa} não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</p><br>
      
      <h3>3. Limitações</h3>
      <p>Em nenhum caso o ${data.empresa} ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em ${data.dominio}, mesmo que ${data.empresa} ou um representante autorizado da ${data.empresa} tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a você.</p><br>
      
      <h3>4. Precisão dos materiais</h3>
      <p>Os materiais exibidos no site da ${data.empresa} podem incluir erros técnicos, tipográficos ou fotográficos. ${data.empresa} não garante que qualquer material em seu site seja preciso, completo ou atual. ${data.empresa} pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, ${data.empresa} não se compromete a atualizar os materiais.</p><br>
      
      <h3>5. Links</h3>
      <p>O ${data.empresa} não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por ${data.empresa} do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p><br>
      
      <h3>6. Modificações</h3>
      <p>O ${data.empresa} pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p><br>
      
      <h3>7. Lei aplicável</h3>
      <p>Estes termos e condições são regidos e interpretados de acordo com as leis do Brasil e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p><br>
      
      <h3>Informações de contato</h3>
      <p>
        Fone: ${data.telefone} | E-mail: <a href="mailto:${data.email}">${data.email}</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}