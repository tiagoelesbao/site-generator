// src/utils/imageProcessing.js
import logger from './logger';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'site_generator';
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Função para comprimir e redimensionar imagem localmente antes do upload
export async function processImageLocally(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
  return new Promise((resolve, reject) => {
    try {
      // Criar Image e Canvas para processamento
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Quando a imagem for carregada
      img.onload = () => {
        // Calcular dimensões proporcionais
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
        
        // Configurar canvas
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para Blob
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };
      
      // Caso ocorra erro no carregamento
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };
      
      // Carregar imagem
      img.src = URL.createObjectURL(file);
    } catch (error) {
      logger.error('Erro ao processar imagem localmente', error);
      reject(error);
    }
  });
}

// Upload para Cloudinary
export async function uploadToCloudinary(imageFile, options = {}) {
  try {
    // Verifica se o arquivo é válido
    if (!imageFile || !(imageFile instanceof Blob)) {
      throw new Error('Arquivo de imagem inválido');
    }
    
    // Processar imagem localmente primeiro
    const processedImage = await processImageLocally(
      imageFile,
      options.maxWidth || 1920,
      options.maxHeight || 1080,
      options.quality || 0.8
    );
    
    // Criar FormData para upload
    const formData = new FormData();
    formData.append('file', processedImage);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Adicionar transformações
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    
    // Upload para Cloudinary
    const response = await fetch(CLOUDINARY_API_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.statusText}`);
    }
    
    // Retornar resposta com URL da imagem
    const result = await response.json();
    
    logger.info('Imagem processada e enviada com sucesso', {
      url: result.secure_url,
      size: result.bytes,
      format: result.format
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    logger.error('Erro ao fazer upload para Cloudinary', error);
    throw error;
  }
}

// Gerar URL para imagem do Cloudinary com transformações
export function getCloudinaryUrl(publicId, options = {}) {
  const transformations = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  
  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/'
    : '';
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}${publicId}`;
}