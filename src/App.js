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
  
  // Use useEffect para limpar o estado de erro
  useEffect(() => {
    if (isGenerating) {
      setGenerationError(null);
    }
  }, [isGenerating]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setHeroImage(file);
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
          disabled={isGenerating} // Desabilitar inputs durante geração
        />
        
        <DownloadButton 
          formData={formData}
          heroImage={heroImage}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          setIsGenerated={setIsGenerated}
          setGenerationError={setGenerationError}
        />
        
        {isGenerated && !generationError && (
          <div className="success-message">
            <p>Site gerado com sucesso! O download deve começar automaticamente.</p>
          </div>
        )}
        
        {generationError && (
          <div className="error-message">
            <p>Erro: {generationError}</p>
            <button onClick={() => setGenerationError(null)}>Fechar</button>
          </div>
        )}
      </main>
      
      <footer>
        <p>&copy; 2025 Gerador de Sites</p>
      </footer>
    </div>
  );
}

export default App;