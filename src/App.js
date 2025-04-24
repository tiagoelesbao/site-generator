// Atualizar src/App.js
import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import DownloadButton from './components/DownloadButton';
import './styles/main.css';

function App() {
  const [formData, setFormData] = useState({
    empresa: '',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    email: '',
    emailLGPD: '',
    telefone: '',
    dominio: '',
    tituloHero: '',
    subtituloHero: '',
    servico1Nome: '',
    servico1Desc: '',
    servico2Nome: '',
    servico2Desc: '',
    servico3Nome: '',
    servico3Desc: '',
    quemSomos: ''
  });
  
  const [heroImage, setHeroImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [publishResult, setPublishResult] = useState(null);
  
  // Limpar o estado de erro quando o usuário interage com o formulário
  useEffect(() => {
    if (generationError) {
      setGenerationError(null);
    }
  }, [formData, heroImage]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar tamanho da imagem (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setGenerationError("A imagem é muito grande. O tamanho máximo é 5MB.");
        return;
      }
      
      setHeroImage(file);
    }
  };
  
  const handlePublishSuccess = (result) => {
    setPublishResult(result);
    setIsGenerated(true);
  };
  
  return (
    <div className="app-container">
      <header>
        <h1>Gerador de Sites</h1>
        <p>Crie um site profissional em minutos</p>
      </header>
      
      <main>
        <Form 
          formData={formData}
          onInputChange={handleInputChange}
          onImageUpload={handleImageUpload}
          disabled={isGenerating}
        />
        
        <DownloadButton 
          formData={formData}
          heroImage={heroImage}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          setIsGenerated={setIsGenerated}
          setGenerationError={setGenerationError}
          onPublishSuccess={handlePublishSuccess}
        />
        
        {isGenerated && !generationError && !publishResult && (
          <div className="success-message">
            <p>Site gerado com sucesso! O download deve começar automaticamente.</p>
          </div>
        )}
        
        {publishResult && (
          <div className="success-message">
            <p>Site publicado com sucesso! URL: <a href={publishResult.site.url} target="_blank" rel="noopener noreferrer">{publishResult.site.url}</a></p>
          </div>
        )}
        
        {generationError && (
          <div className="error-message">
            <p>Erro: {generationError}</p>
            <button 
              onClick={() => setGenerationError(null)}
              className="close-error-button"
            >
              Fechar
            </button>
          </div>
        )}
      </main>
      
      <footer>
        <p>&copy; {new Date().getFullYear()} Gerador de Sites</p>
      </footer>
    </div>
  );
}

export default App;