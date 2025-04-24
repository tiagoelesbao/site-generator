import JSZip from 'jszip';

export async function createSiteZip(htmlContent, cssContent, jsContent, privacyPolicy, termsOfService, heroImage) {
  try {
    const zip = new JSZip();
    
    // Configurar compressão para reduzir o tamanho
    const compressionOptions = {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6 // Equilíbrio entre velocidade e compressão (1-9)
      }
    };
    
    // Verificar se a imagem do hero foi fornecida e gerar uma nova versão do HTML
    if (heroImage) {
      // Adicionar referência à imagem no CSS
      cssContent = cssContent.replace(
        '.hero-section {',
        '.hero-section {\n  background-image: url("imagens/hero-bg.jpg");\n  background-size: cover;\n  background-position: center;\n'
      );
      
      // Certificar-se de que o texto do hero tenha um bom contraste
      cssContent = cssContent.replace(
        '.hero-content {',
        '.hero-content {\n  background-color: rgba(255, 255, 255, 0.8);\n  padding: 2rem;\n  border-radius: 4px;\n'
      );
    }
    
    // Criar o favicon dinâmico
    const faviconSvg = generateFaviconSVG(htmlContent);

    // Adicionar arquivos principais
    zip.file("index.html", htmlContent);
    zip.file("style.css", cssContent);
    zip.file("script.js", jsContent);
    zip.file("favicon.svg", faviconSvg);
    
    // Adicionar referência ao favicon no HTML
    const headEndIndex = htmlContent.indexOf('</head>');
    if (headEndIndex !== -1) {
      const htmlWithFavicon = 
        htmlContent.slice(0, headEndIndex) + 
        '\n  <link rel="icon" href="favicon.svg" type="image/svg+xml">\n' +
        htmlContent.slice(headEndIndex);
      
      zip.file("index.html", htmlWithFavicon);
      
      // Atualizar também os documentos legais para incluir o favicon
      const updatedPrivacyPolicy = addFaviconToHtml(privacyPolicy);
      const updatedTermsOfService = addFaviconToHtml(termsOfService);
      
      zip.file("politica-privacidade.html", updatedPrivacyPolicy);
      zip.file("termos-uso.html", updatedTermsOfService);
    } else {
      // Se não conseguir encontrar o </head>, use o HTML original
      zip.file("index.html", htmlContent);
      zip.file("politica-privacidade.html", privacyPolicy);
      zip.file("termos-uso.html", termsOfService);
    }
    
    // Criar pasta para imagens
    const imgFolder = zip.folder("imagens");
    
    // Processar imagem do hero de forma mais eficiente
    if (heroImage) {
      if (heroImage.size > 5000000) { // 5MB
        console.warn('Imagem muito grande, pode causar problemas de memória');
        // Aqui você poderia implementar redimensionamento de imagem
      }
      
      // Processar a imagem em chunks para evitar problemas de memória
      const reader = new FileReader();
      reader.readAsArrayBuffer(heroImage);
      
      const imageArrayBuffer = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      
      imgFolder.file("hero-bg.jpg", imageArrayBuffer);
    } else {
      // Adicionar imagem padrão suave
      const defaultHeroImage = generateDefaultHeroImage();
      imgFolder.file("hero-bg.jpg", defaultHeroImage);
    }
    
    // Gerar o arquivo ZIP com opções de compressão
    const zipBlob = await zip.generateAsync(compressionOptions);
    return zipBlob;
  } catch (error) {
    console.error("Erro ao criar arquivo ZIP:", error);
    throw error;
  }
}

// Função para adicionar favicon às páginas HTML
function addFaviconToHtml(htmlContent) {
  const headEndIndex = htmlContent.indexOf('</head>');
  if (headEndIndex !== -1) {
    return htmlContent.slice(0, headEndIndex) + 
           '\n  <link rel="icon" href="favicon.svg" type="image/svg+xml">\n' +
           htmlContent.slice(headEndIndex);
  }
  return htmlContent;
}

// Função para gerar um favicon SVG dinâmico baseado nos dados da empresa
function generateFaviconSVG(htmlContent) {
  // Extrair o nome da empresa do HTML
  let companyName = "";
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
  if (titleMatch && titleMatch[1]) {
    companyName = titleMatch[1].split('-')[0].trim();
  }
  
  // Gerar iniciais ou primeira letra
  let initials = "";
  if (companyName) {
    const words = companyName.split(/\s+/);
    if (words.length >= 2) {
      // Pegar as iniciais das duas primeiras palavras
      initials = words[0][0] + words[1][0];
    } else if (words.length === 1 && words[0].length > 0) {
      // Pegar a primeira letra da única palavra
      initials = words[0][0];
    }
  }
  
  // Se não conseguir extrair iniciais, use um ícone genérico
  if (!initials) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#f5f5f5"/>
  <path d="M25 50C25 36.2 36.2 25 50 25C63.8 25 75 36.2 75 50C75 63.8 63.8 75 50 75" stroke="#000" stroke-width="6" stroke-linecap="round"/>
  <path d="M50 75L50 55" stroke="#000" stroke-width="6" stroke-linecap="round"/>
  <path d="M50 50L62 50" stroke="#000" stroke-width="6" stroke-linecap="round"/>
</svg>`;
  }
  
  // Gerar cores baseadas nas iniciais (para ter consistência)
  const hash = initials.charCodeAt(0) + (initials.length > 1 ? initials.charCodeAt(1) : 0);
  const hue = hash % 360; // Valor entre 0 e 359
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="hsl(${hue}, 70%, 95%)"/>
  <circle cx="50" cy="50" r="35" fill="hsl(${hue}, 70%, 60%)"/>
  <text x="50" y="65" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
</svg>`;
}

// Função para gerar uma imagem de fundo padrão para o hero
function generateDefaultHeroImage() {
  // Aqui você pode retornar um ArrayBuffer com uma imagem padrão
  // Como é complexo gerar uma imagem de verdade diretamente no JavaScript,
  // vamos criar um SVG com um gradiente suave codificado em base64
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f5f7fa;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#c3cfe2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#grad)" />
    <path d="M0,1080 L1920,1080 L1920,810 C1600,1000 1360,900 1080,950 C800,1000 480,800 240,900 C0,1000 0,1080 0,1080 Z" fill="#ffffff" opacity="0.3" />
    <path d="M0,1080 L1920,1080 L1920,910 C1760,950 1440,850 1120,900 C800,950 480,900 240,950 C0,1000 0,1080 0,1080 Z" fill="#ffffff" opacity="0.5" />
  </svg>`;
  
  // Converter o SVG para base64
  const base64Data = btoa(svgContent);
  
  // Converter base64 para ArrayBuffer
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}

export function downloadZip(zipBlob, siteName) {
  // Normalizar o nome do site para usar no nome do arquivo
  const safeFileName = siteName
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
  
  // Criar link para download e acionar clique
  const downloadUrl = URL.createObjectURL(zipBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = `${safeFileName || 'meu-site'}.zip`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Limpar a URL para liberar memória
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 100);
}