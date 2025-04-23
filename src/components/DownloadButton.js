import React from 'react';
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
  const handleGenerateSite = async () => {
    // Validar se os campos obrigatórios estão preenchidos
    if (!formData.empresa || !formData.tituloHero) {
      alert('Por favor, preencha pelo menos o nome da empresa e o título principal.');
      return;
    }
    
    setIsGenerating(true);
    setIsGenerated(false);
    
    try {
      // Chamar a API do OpenAI para gerar o código do site
      const response = await generateSite(formData);
      
      // Extrair HTML, CSS e JS da resposta
      const { htmlContent, cssContent, jsContent } = extractFiles(response);
      
      // Gerar documentos legais
      const privacyPolicy = generatePrivacyPolicy(formData);
      const termsOfService = generateTermsOfService(formData);
      
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
      alert('Ocorreu um erro ao gerar o site. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <button 
      className="download-button"
      onClick={handleGenerateSite}
      disabled={isGenerating}
    >
      {isGenerating ? 'Gerando site...' : 'Gerar e Baixar Site'}
    </button>
  );
}

export default DownloadButton;