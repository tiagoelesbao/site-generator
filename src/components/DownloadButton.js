import React, { useState } from 'react';
import { generateSite } from '../utils/generateSite';
import { extractFiles } from '../utils/fileGenerator';
import { createSiteZip, downloadZip } from '../utils/zipCreator';
import { generatePrivacyPolicy } from '../templates/privacyTemplate';
import { generateTermsOfService } from '../templates/termsTemplate';

function DownloadButton({ 
  formData, 
  heroImage, 
  isGenerating, 
  setIsGenerating, 
  setIsGenerated 
}) {
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const requiredFields = [
      { field: formData.empresa, name: 'Nome da Empresa' },
      { field: formData.email, name: 'Email de Contato' },
      { field: formData.tituloHero, name: 'Título Principal' }
    ];
    
    const missingFields = requiredFields
      .filter(item => !item.field)
      .map(item => item.name);
    
    if (missingFields.length > 0) {
      setErrorMessage(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
      return false;
    }
    
    setErrorMessage('');
    return true;
  };

  const handleGenerateSite = async () => {
    // Validar formulário
    if (!validateForm()) {
      return;
    }
    
    setIsGenerating(true);
    setIsGenerated(false);
    setErrorMessage('');
    
    try {
      // Chamar a API do OpenAI para gerar o código do site
      const response = await generateSite(formData);
      
      // Extrair HTML, CSS e JS da resposta
      const { htmlContent, cssContent, jsContent } = extractFiles(response);
      
      // Gerar documentos legais
      let privacyPolicy, termsOfService;
      
      try {
        privacyPolicy = generatePrivacyPolicy(formData);
      } catch (error) {
        console.error('Erro ao gerar política de privacidade:', error);
        privacyPolicy = getDefaultPrivacyPolicy(formData);
      }
      
      try {
        termsOfService = generateTermsOfService(formData);
      } catch (error) {
        console.error('Erro ao gerar termos de uso:', error);
        termsOfService = getDefaultTermsOfService(formData);
      }
      
      // Criar arquivo ZIP
      const zipBlob = await createSiteZip(
        htmlContent, 
        cssContent, 
        jsContent, 
        privacyPolicy, 
        termsOfService, 
        heroImage
      );
      
      // Oferecer para download
      downloadZip(zipBlob, formData.empresa);
      
      setIsGenerated(true);
    } catch (error) {
      console.error('Erro ao gerar site:', error);
      setErrorMessage('Ocorreu um erro ao gerar o site. Por favor, verifique a conexão com a internet e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Função para gerar política de privacidade padrão caso ocorra erro
  const getDefaultPrivacyPolicy = (data) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Política de Privacidade - ${data.empresa || 'Empresa'}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="logo">
        <h1>${data.empresa || 'Empresa'}</h1>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="index.html">Voltar para o site</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="container">
    <div class="legal-content">
      <h2>Política de Privacidade</h2>
      <p>O site ${data.dominio || 'empresa.com.br'} é de propriedade da ${data.razaoSocial || 'Empresa'}, que atua como controlador dos seus dados pessoais.</p>
      <p>Adotamos esta Política de Privacidade, que determina como processamos as informações coletadas e também explica por que precisamos coletar determinados dados pessoais sobre você.</p>
      <p>Contato: ${data.telefone || '(00) 0000-0000'} | Email: ${data.email || 'contato@empresa.com'}</p>
    </div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2025 ${data.empresa || 'Empresa'}. Todos os direitos reservados.</p>
    </div>
  </footer>
</body>
</html>`;
  };
  
  // Função para gerar termos de uso padrão caso ocorra erro
  const getDefaultTermsOfService = (data) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termos de Uso - ${data.empresa || 'Empresa'}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="logo">
        <h1>${data.empresa || 'Empresa'}</h1>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="index.html">Voltar para o site</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="container">
    <div class="legal-content">
      <h2>Termos de Uso</h2>
      <p>Bem-vindo aos Termos de Uso do site ${data.dominio || 'empresa.com.br'}, de propriedade da ${data.razaoSocial || 'Empresa'}.</p>
      <p>Ao acessar este site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
      <p>Contato: ${data.telefone || '(00) 0000-0000'} | Email: ${data.email || 'contato@empresa.com'}</p>
    </div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2025 ${data.empresa || 'Empresa'}. Todos os direitos reservados.</p>
    </div>
  </footer>
</body>
</html>`;
  };
  
  return (
    <div className="download-section">
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <button 
        className="download-button"
        onClick={handleGenerateSite}
        disabled={isGenerating}
      >
        {isGenerating ? 'Gerando site...' : 'Gerar e Baixar Site'}
      </button>
      
      {isGenerating && (
        <div className="loading-indicator">
          <p>Isso pode levar alguns instantes...</p>
        </div>
      )}
    </div>
  );
}

export default DownloadButton;