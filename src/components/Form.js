import React, { useState } from 'react';
import FormField from './FormField';
import '../styles/form.css';

function Form({ formData, onInputChange, onImageUpload, disabled = false }) {
  const [activeSection, setActiveSection] = useState('empresa');
  
  // Definir as seções do formulário
  const sections = [
    { id: 'empresa', label: 'Dados da Empresa' },
    { id: 'hero', label: 'Seção Hero' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'quemSomos', label: 'Quem Somos' }
  ];
  
  return (
    <div className="form-container">
      <h2>Preencha os dados do seu site</h2>
      
      {/* Navegação por tabs */}
      <div className="form-tabs">
        {sections.map(section => (
          <button
            key={section.id}
            className={`form-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
            disabled={disabled}
          >
            {section.label}
          </button>
        ))}
      </div>
      
      {/* Seção: Dados da Empresa */}
      {activeSection === 'empresa' && (
        <div className="form-section">
          <FormField
            label="Nome da Empresa *"
            name="empresa"
            value={formData.empresa}
            onChange={onInputChange}
            disabled={disabled}
            required
          />
          
          <FormField
            label="Razão Social"
            name="razaoSocial"
            value={formData.razaoSocial}
            onChange={onInputChange}
            disabled={disabled}
          />
          
          <FormField
            label="CNPJ"
            name="cnpj"
            value={formData.cnpj}
            onChange={onInputChange}
            disabled={disabled}
          />
          
          <FormField
            label="Endereço"
            name="endereco"
            value={formData.endereco}
            onChange={onInputChange}
            isTextarea={true}
            disabled={disabled}
          />
          
          <FormField
            label="E-mail de Contato *"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            type="email"
            disabled={disabled}
            required
          />
          
          <FormField
            label="E-mail para LGPD"
            name="emailLGPD"
            value={formData.emailLGPD}
            onChange={onInputChange}
            type="email"
            disabled={disabled}
          />
          
          <FormField
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={onInputChange}
            disabled={disabled}
          />
          
          <FormField
            label="Domínio (ex: meusite.com.br)"
            name="dominio"
            value={formData.dominio}
            onChange={onInputChange}
            disabled={disabled}
          />
          
          <div className="section-navigation">
            <button 
              className="nav-button next" 
              onClick={() => setActiveSection('hero')}
              disabled={disabled}
            >
              Próximo: Seção Hero →
            </button>
          </div>
        </div>
      )}
      
      {/* Seção: Hero */}
      {activeSection === 'hero' && (
        <div className="form-section">
          <FormField
            label="Título Principal *"
            name="tituloHero"
            value={formData.tituloHero}
            onChange={onInputChange}
            disabled={disabled}
            required
          />
          
          <FormField
            label="Subtítulo"
            name="subtituloHero"
            value={formData.subtituloHero}
            onChange={onInputChange}
            disabled={disabled}
          />
          
          <div className="form-field">
            <label>Imagem de Fundo</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              disabled={disabled}
            />
            <p className="field-tip">Recomendado: 1920x1080px ou maior</p>
          </div>
          
          <div className="section-navigation">
            <button 
              className="nav-button prev" 
              onClick={() => setActiveSection('empresa')}
              disabled={disabled}
            >
              ← Anterior: Dados da Empresa
            </button>
            <button 
              className="nav-button next" 
              onClick={() => setActiveSection('servicos')}
              disabled={disabled}
            >
              Próximo: Serviços →
            </button>
          </div>
        </div>
      )}
      
      {/* Seção: Serviços */}
      {activeSection === 'servicos' && (
        <div className="form-section">
          <div className="service-group">
            <h4>Serviço 1</h4>
            <FormField
              label="Nome do Serviço"
              name="servico1Nome"
              value={formData.servico1Nome}
              onChange={onInputChange}
              disabled={disabled}
            />
            
            <FormField
              label="Descrição"
              name="servico1Desc"
              value={formData.servico1Desc}
              onChange={onInputChange}
              isTextarea={true}
              disabled={disabled}
            />
          </div>
          
          <div className="service-group">
            <h4>Serviço 2</h4>
            <FormField
              label="Nome do Serviço"
              name="servico2Nome"
              value={formData.servico2Nome}
              onChange={onInputChange}
              disabled={disabled}
            />
            
            <FormField
              label="Descrição"
              name="servico2Desc"
              value={formData.servico2Desc}
              onChange={onInputChange}
              isTextarea={true}
              disabled={disabled}
            />
          </div>
          
          <div className="service-group">
            <h4>Serviço 3</h4>
            <FormField
              label="Nome do Serviço"
              name="servico3Nome"
              value={formData.servico3Nome}
              onChange={onInputChange}
              disabled={disabled}
            />
            
            <FormField
              label="Descrição"
              name="servico3Desc"
              value={formData.servico3Desc}
              onChange={onInputChange}
              isTextarea={true}
              disabled={disabled}
            />
          </div>
          
          <div className="section-navigation">
            <button 
              className="nav-button prev" 
              onClick={() => setActiveSection('hero')}
              disabled={disabled}
            >
              ← Anterior: Seção Hero
            </button>
            <button 
              className="nav-button next" 
              onClick={() => setActiveSection('quemSomos')}
              disabled={disabled}
            >
              Próximo: Quem Somos →
            </button>
          </div>
        </div>
      )}
      
      {/* Seção: Quem Somos */}
      {activeSection === 'quemSomos' && (
        <div className="form-section">
          <FormField
            label="Texto Institucional"
            name="quemSomos"
            value={formData.quemSomos}
            onChange={onInputChange}
            isTextarea={true}
            rows={6}
            disabled={disabled}
          />
          
          <div className="section-navigation">
            <button 
              className="nav-button prev" 
              onClick={() => setActiveSection('servicos')}
              disabled={disabled}
            >
              ← Anterior: Serviços
            </button>
            <button 
              className="nav-button complete" 
              onClick={() => setActiveSection('empresa')}
              disabled={disabled}
            >
              Concluir e Revisar
            </button>
          </div>
        </div>
      )}
      
      {/* Indicador de campos obrigatórios */}
      <div className="required-fields-note">
        <p>* Campos obrigatórios</p>
      </div>
    </div>
  );
}

export default Form;