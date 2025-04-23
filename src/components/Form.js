import React from 'react';
import FormField from './FormField';
import '../styles/form.css';

function Form({ formData, onInputChange, onImageUpload }) {
  return (
    <div className="form-container">
      <h2>Preencha os dados do seu site</h2>
      
      <div className="form-section">
        <h3>Dados da Empresa</h3>
        
        <FormField
          label="Nome da Empresa"
          name="empresa"
          value={formData.empresa}
          onChange={onInputChange}
        />
        
        <FormField
          label="Razão Social"
          name="razaoSocial"
          value={formData.razaoSocial}
          onChange={onInputChange}
        />
        
        <FormField
          label="CNPJ"
          name="cnpj"
          value={formData.cnpj}
          onChange={onInputChange}
        />
        
        <FormField
          label="Endereço"
          name="endereco"
          value={formData.endereco}
          onChange={onInputChange}
          isTextarea={true}
        />
        
        <FormField
          label="E-mail de Contato"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          type="email"
        />
        
        <FormField
          label="E-mail para LGPD"
          name="emailLGPD"
          value={formData.emailLGPD}
          onChange={onInputChange}
          type="email"
        />
        
        <FormField
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={onInputChange}
        />
        
        <FormField
          label="Domínio (ex: meusite.com.br)"
          name="dominio"
          value={formData.dominio}
          onChange={onInputChange}
        />
      </div>
      
      <div className="form-section">
        <h3>Seção Hero</h3>
        
        <FormField
          label="Título Principal"
          name="tituloHero"
          value={formData.tituloHero}
          onChange={onInputChange}
        />
        
        <FormField
          label="Subtítulo"
          name="subtituloHero"
          value={formData.subtituloHero}
          onChange={onInputChange}
        />
        
        <div className="form-field">
          <label>Imagem de Fundo</label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
          />
          <p className="field-tip">Recomendado: 1920x1080px ou maior</p>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Serviços</h3>
        
        <div className="service-group">
          <h4>Serviço 1</h4>
          <FormField
            label="Nome do Serviço"
            name="servico1Nome"
            value={formData.servico1Nome}
            onChange={onInputChange}
          />
          
          <FormField
            label="Descrição"
            name="servico1Desc"
            value={formData.servico1Desc}
            onChange={onInputChange}
            isTextarea={true}
          />
        </div>
        
        <div className="service-group">
          <h4>Serviço 2</h4>
          <FormField
            label="Nome do Serviço"
            name="servico2Nome"
            value={formData.servico2Nome}
            onChange={onInputChange}
          />
          
          <FormField
            label="Descrição"
            name="servico2Desc"
            value={formData.servico2Desc}
            onChange={onInputChange}
            isTextarea={true}
          />
        </div>
        
        <div className="service-group">
          <h4>Serviço 3</h4>
          <FormField
            label="Nome do Serviço"
            name="servico3Nome"
            value={formData.servico3Nome}
            onChange={onInputChange}
          />
          
          <FormField
            label="Descrição"
            name="servico3Desc"
            value={formData.servico3Desc}
            onChange={onInputChange}
            isTextarea={true}
          />
        </div>
      </div>
      
      <div className="form-section">
        <h3>Quem Somos</h3>
        
        <FormField
          label="Texto Institucional"
          name="quemSomos"
          value={formData.quemSomos}
          onChange={onInputChange}
          isTextarea={true}
          rows={6}
        />
      </div>
    </div>
  );
}

export default Form;