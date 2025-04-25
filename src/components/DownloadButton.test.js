// src/components/DownloadButton.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DownloadButton from './DownloadButton';
import { SiteProvider } from '../context/SiteContext';
import * as generateSiteModule from '../utils/generateSite';

// Mock das funções
jest.mock('../utils/generateSite', () => ({
  generateSite: jest.fn(),
}));

jest.mock('../utils/fileGenerator', () => ({
  extractFiles: jest.fn(() => ({
    htmlContent: '<html></html>',
    cssContent: 'body {}',
    jsContent: 'console.log("test")',
  })),
}));

jest.mock('../utils/zipCreator', () => ({
  createSiteZip: jest.fn(() => new Blob(['test'], { type: 'application/zip' })),
  downloadZip: jest.fn(),
}));

describe('DownloadButton', () => {
  const mockProps = {
    formData: {
      empresa: 'Teste',
      email: 'teste@example.com',
      tituloHero: 'Título de Teste',
    },
    heroImage: null,
    isGenerating: false,
    setIsGenerating: jest.fn(),
    setIsGenerated: jest.fn(),
    setGenerationError: jest.fn(),
    onPublishSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    generateSiteModule.generateSite.mockResolvedValue({
      choices: [{ message: { content: '```html\n<html></html>\n```\n```css\nbody {}\n```\n```javascript\nconsole.log("test")\n```' } }],
    });
  });

  test('deve renderizar o botão de download', () => {
    render(
      <SiteProvider>
        <DownloadButton {...mockProps} />
      </SiteProvider>
    );
    
    expect(screen.getByText('Gerar e Baixar Site')).toBeInTheDocument();
  });

  test('deve validar campos obrigatórios', async () => {
    render(
      <SiteProvider>
        <DownloadButton 
          {...mockProps} 
          formData={{ empresa: '', email: '', tituloHero: '' }} 
        />
      </SiteProvider>
    );
    
    fireEvent.click(screen.getByText('Gerar e Baixar Site'));
    
    await waitFor(() => {
      expect(mockProps.setGenerationError).toHaveBeenCalledWith(expect.stringContaining('campos obrigatórios'));
    });
  });

  test('deve gerar o site com sucesso', async () => {
    render(
      <SiteProvider>
        <DownloadButton {...mockProps} />
      </SiteProvider>
    );
    
    fireEvent.click(screen.getByText('Gerar e Baixar Site'));
    
    await waitFor(() => {
      expect(mockProps.setIsGenerating).toHaveBeenCalledWith(true);
      expect(generateSiteModule.generateSite).toHaveBeenCalled();
      expect(mockProps.setIsGenerated).toHaveBeenCalledWith(true);
    });
  });
});