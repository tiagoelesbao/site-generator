// src/components/Form.js - Versão aprimorada com UI premium
import React, { useState } from 'react';
import FormField from './FormField';

function Form({ formData, onInputChange, onImageUpload, disabled = false }) {
  const [activeSection, setActiveSection] = useState('empresa');
  
  // Definir as seções do formulário
  const sections = [
    { id: 'empresa', label: 'Dados da Empresa', icon: 'building' },
    { id: 'hero', label: 'Seção Hero', icon: 'image' },
    { id: 'servicos', label: 'Serviços', icon: 'package' },
    { id: 'quemSomos', label: 'Quem Somos', icon: 'info' }
  ];
  
  // Renderizar ícone de seção
  const renderSectionIcon = (icon) => {
    switch(icon) {
      case 'building':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="section-icon">
            <path d="M19 22H5C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H15L20 7V21C20 21.5523 19.5523 22 19 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'image':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="section-icon">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'package':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="section-icon">
            <path d="M12 21L2 16V8L12 3L22 8V16L12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 21V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 8L12 12L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 5.5L7 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'info':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="section-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="8" r="1" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="form-container">
      <h2>Preencha os dados do seu site</h2>
      
      {/* Navegação por tabs com ícones */}
      <div className="form-tabs">
        {sections.map(section => (
          <button
            key={section.id}
            className={`form-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
            disabled={disabled}
          >
            {renderSectionIcon(section.icon)}
            <span>{section.label}</span>
          </button>
        ))}
      </div>
      
      {/* Seção: Dados da Empresa */}
      {activeSection === 'empresa' && (
        <div className="form-section">
          <div className="section-header">
            <h3>Dados da Empresa</h3>
            <div className="section-line"></div>
          </div>
          
          <div className="form-grid">
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
          </div>
          
          <div className="form-grid">
            <FormField
              label="CNPJ"
              name="cnpj"
              value={formData.cnpj}
              onChange={onInputChange}
              disabled={disabled}
            />
            
            <FormField
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={onInputChange}
              disabled={disabled}
            />
          </div>
          
          <FormField
            label="Endereço"
            name="endereco"
            value={formData.endereco}
            onChange={onInputChange}
            isTextarea={true}
            disabled={disabled}
          />
          
          <div className="form-grid">
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
          </div>
          
          <FormField
            label="Domínio (ex: meusite.com.br)"
            name="dominio"
            value={formData.dominio}
            onChange={onInputChange}
            disabled={disabled}
          />
          
          <div className="section-navigation">
            <button 
              className="next-button" 
              onClick={() => setActiveSection('hero')}
              disabled={disabled}
            >
              Próximo <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Seção: Hero */}
      {activeSection === 'hero' && (
        <div className="form-section">
          <div className="section-header">
            <h3>Seção Hero</h3>
            <div className="section-line"></div>
          </div>
          
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
          
          <div className="form-field file-upload-field">
            <label>Imagem de Fundo</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="hero-image"
                accept="image/*"
                onChange={onImageUpload}
                disabled={disabled}
                className="file-input"
              />
              <label htmlFor="hero-image" className="file-upload-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 16V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V16M12 3L7 8M12 3L17 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Escolher arquivo
              </label>
            </div>
            <p className="field-tip">Recomendado: 1920x1080px ou maior</p>
          </div>
          
          <div className="section-navigation">
            <button 
              className="prev-button" 
              onClick={() => setActiveSection('empresa')}
              disabled={disabled}
            >
              <span className="button-icon">←</span> Anterior
            </button>
            <button 
              className="next-button" 
              onClick={() => setActiveSection('servicos')}
              disabled={disabled}
            >
              Próximo <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Seção: Serviços */}
      {activeSection === 'servicos' && (
        <div className="form-section">
          <div className="section-header">
            <h3>Serviços</h3>
            <div className="section-line"></div>
          </div>
          
          <div className="service-group">
            <div className="service-header">
              <div className="service-number">1</div>
              <h4>Serviço 1</h4>
            </div>
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
            <div className="service-header">
              <div className="service-number">2</div>
              <h4>Serviço 2</h4>
            </div>
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
            <div className="service-header">
              <div className="service-number">3</div>
              <h4>Serviço 3</h4>
            </div>
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
              className="prev-button" 
              onClick={() => setActiveSection('hero')}
              disabled={disabled}
            >
              <span className="button-icon">←</span> Anterior
            </button>
            <button 
              className="next-button" 
              onClick={() => setActiveSection('quemSomos')}
              disabled={disabled}
            >
              Próximo <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Seção: Quem Somos */}
      {activeSection === 'quemSomos' && (
        <div className="form-section">
          <div className="section-header">
            <h3>Quem Somos</h3>
            <div className="section-line"></div>
          </div>
          
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
              className="prev-button" 
              onClick={() => setActiveSection('servicos')}
              disabled={disabled}
            >
              <span className="button-icon">←</span> Anterior
            </button>
            <button 
              className="complete-button" 
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
        <span className="required-indicator">*</span> Campos obrigatórios
      </div>
    </div>
  );
}

export default Form;