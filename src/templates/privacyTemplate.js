export function generatePrivacyPolicy(data) {
    return `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Política de Privacidade - ${data.empresa}</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div id="modal-privacidade" class="modal-content">
      <h2>Política de Privacidade</h2>
      <div class="modal-text">
        <p>O site ${data.dominio} é de propriedade da ${data.razaoSocial}, que atua como controlador dos seus dados pessoais.</p><br>
        <p>Adotamos esta Política de Privacidade, a qual determina como processamos as informações coletadas pelo ${data.empresa} e também explica por que precisamos coletar determinados dados pessoais sobre você. Portanto, é fundamental que você leia esta Política de Privacidade antes de utilizar o site ${data.dominio}.</p><br>
        <p>Cuidamos dos seus dados pessoais e nos comprometemos a garantir sua confidencialidade e segurança.</p><br>
        
        <h3>Informações pessoais que coletamos</h3>
        <p>Ao visitar o ${data.dominio}, coletamos automaticamente determinadas informações sobre o seu dispositivo, incluindo informações sobre o navegador da web, endereço IP, fuso horário e alguns dos cookies instalados em seu dispositivo. Além disso, conforme você navega pelo site, coletamos informações sobre as páginas ou produtos específicos que você visualiza, quais sites ou termos de pesquisa o encaminharam ao nosso site e como você interage com o site. Referimo-nos a essas informações coletadas automaticamente como "Informações do Dispositivo".</p>
        <p>Além disso, podemos coletar os dados pessoais que você nos fornece (incluindo, mas não se limitando a nome, sobrenome, endereço, informações de pagamento, etc.) durante o processo de registro, para que possamos cumprir o contrato estabelecido com você.</p>
        <br>
        
        <!-- Resto do template continua com as seções padrão -->
        
        <h3>Informações de contato</h3>
        <p>Se você deseja nos contatar para entender mais sobre esta Política ou se pretende tratar de qualquer assunto relacionado aos seus direitos individuais e às suas Informações Pessoais, entre em contato através dos seguintes canais:</p>
        <p>
          Fone: ${data.telefone} | E-mail: <a href="mailto:${data.email}">${data.email}</a> ou para demandas relacionadas à LGPD, nos procure no e-mail: <a href="mailto:${data.emailLGPD}">${data.emailLGPD}</a>
        </p>
      </div>
    </div>
  </body>
  </html>`;
  }