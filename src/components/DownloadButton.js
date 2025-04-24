// Arquivo: src/components/DownloadButton.js (modificado)

import React, { useState } from 'react';
import { generateSite } from '../utils/generateSite';
import { extractFiles } from '../utils/fileGenerator';
import { createSiteZip, downloadZip } from '../utils/zipCreator';
import { generatePrivacyPolicy } from '../templates/privacyTemplate';
import { generateTermsOfService } from '../templates/termsTemplate';
import PublishSiteModal from './PublishSiteModal'; // Importar novo componente

function DownloadButton({ 
  formData, 
  heroImage, 
  isGenerating, 
  setIsGenerating, 
  setIsGenerated 
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [zipBlob, setZipBlob] = useState(null); // Armazenar o blob do ZIP
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false); // Estado para o modal
  const [isPublishing, setIsPublishing] = useState(false); // Estado de publicação
  const [publishResult, setPublishResult] = useState(null); // Resultado da publicação
  const [publishError, setPublishError] = useState(null); // Erro de publicação

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

  const generateSiteFiles = async () => {
    // Validar formulário
    if (!validateForm()) {
      return null;
    }
    
    // Adicionar um timeout mais longo para a operação
    const TIMEOUT_DURATION = 120000; // 2 minutos
    
    // Criar uma promise com timeout
    const generateWithTimeout = async () => {
      return new Promise(async (resolve, reject) => {
        // Configurar timeout
        const timeoutId = setTimeout(() => {
          reject(new Error('A operação demorou muito tempo para ser concluída. Tente novamente.'));
        }, TIMEOUT_DURATION);
        
        try {
          setIsGenerating(true);
          setIsGenerated(false);
          setErrorMessage('');
          
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
          const zipBlobResult = await createSiteZip(
            htmlContent, 
            cssContent, 
            jsContent, 
            privacyPolicy, 
            termsOfService, 
            heroImage
          );
          
          setZipBlob(zipBlobResult);
          setIsGenerated(true);
          
          // Limpar o timeout se tudo correu bem
          clearTimeout(timeoutId);
          resolve(zipBlobResult);
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
        }
      });
    };
    
    try {
      return await generateWithTimeout();
    } catch (error) {
      console.error('Erro ao gerar site:', error);
      setErrorMessage(`Ocorreu um erro: ${error.message}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSite = async () => {
    const zipBlobResult = await generateSiteFiles();
    
    if (zipBlobResult) {
      // Oferecer para download
      downloadZip(zipBlobResult, formData.empresa);
    }
  };
  
  // Função atualizada para publicação online usando Netlify Functions
  const handlePublishSite = async () => {
    try {
      // Se já temos o ZIP, abrir o modal primeiro
      if (zipBlob) {
        setIsPublishModalOpen(true);
        return;
      }
      
      // Se não temos o ZIP, gerar primeiro
      const zipBlobResult = await generateSiteFiles();
      
      if (zipBlobResult) {
        // Abrir o modal com o ZIP pronto
        setIsPublishModalOpen(true);
      }
    } catch (error) {
      console.error('Erro ao preparar site para publicação:', error);
      setErrorMessage(`Erro ao preparar site: ${error.message}`);
    }
  };

  // Função para processar a publicação real (chamada a partir do modal)
  const handlePublishToNetlify = async () => {
    if (!zipBlob) return;
    
    try {
      setIsPublishing(true);
      setPublishError(null);
      
      // Converter o zipBlob para base64
      const reader = new FileReader();
      reader.readAsDataURL(zipBlob);
      
      const zipBase64 = await new Promise((resolve) => {
        reader.onloadend = () => {
          // Remove o prefixo "data:application/zip;base64," para obter apenas o base64
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
      });
      
      // Chamar a função Netlify
      const response = await fetch('/.netlify/functions/deploy-site', {
        method: 'POST',
        body: JSON.stringify({
          siteName: formData.empresa.toLowerCase().replace(/[^\w]/g, '-'),
          zipFileBase64: zipBase64
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setPublishResult(result);
        
        // Chamar o callback de sucesso
        if (handlePublishSuccess) {
          handlePublishSuccess(result);
        }
        
        return result;
      } else {
        throw new Error(result.message || 'Erro ao publicar site');
      }
    } catch (error) {
      console.error('Erro ao publicar site:', error);
      setPublishError(error.message);
      
      // Chamar o callback de erro
      if (handlePublishError) {
        handlePublishError(error);
      }
      
      throw error;
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handlePublishSuccess = (result) => {
    console.log('Site publicado com sucesso:', result);
    // Você pode implementar mais ações aqui, como salvar o histórico, etc.
  };
  
  const handlePublishError = (error) => {
    console.error('Erro ao publicar site:', error);
    setErrorMessage(`Erro na publicação: ${error.message}`);
  };
  
  // Função para gerar política de privacidade padrão caso ocorra erro
  const getDefaultPrivacyPolicy = (data) => {
    // Manter o código original
    return `<!DOCTYPE html>
    <!-- Código HTML da política de privacidade -->
    </html>`;
  };
  
  // Função para gerar termos de uso padrão caso ocorra erro
  const getDefaultTermsOfService = (data) => {
    // Manter o código original
    return `<!DOCTYPE html>
    <!-- Código HTML dos termos de uso -->
    </html>`;
  };
  
  return (
    <div className="download-section">
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="action-buttons">
        <button 
          className="download-button"
          onClick={handleGenerateSite}
          disabled={isGenerating || isPublishing}
        >
          {isGenerating ? 'Gerando site...' : 'Gerar e Baixar Site'}
        </button>
        
        <button 
          className="publish-button"
          onClick={handlePublishSite}
          disabled={isGenerating || isPublishing}
        >
          {isGenerating ? 'Gerando site...' : isPublishing ? 'Publicando...' : 'Gerar e Publicar Online'}
        </button>
      </div>
      
      {isGenerating && (
        <div className="loading-indicator">
          <p>Isso pode levar alguns instantes...</p>
        </div>
      )}
      
      {/* Modal de publicação */}
      <PublishSiteModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        siteData={formData}
        zipBlob={zipBlob}
        onPublish={handlePublishToNetlify}
        isPublishing={isPublishing}
        publishResult={publishResult}
        publishError={publishError}
        onPublishSuccess={handlePublishSuccess}
        onPublishError={handlePublishError}
      />
    </div>
  );
}

export default DownloadButton;