import JSZip from 'jszip';

export async function createSiteZip(htmlContent, cssContent, jsContent, privacyPolicy, termsOfService, heroImage) {
  try {
    const zip = new JSZip();
    
    // Adicionar arquivos principais
    zip.file("index.html", htmlContent);
    zip.file("style.css", cssContent);
    zip.file("script.js", jsContent);
    
    // Adicionar documentos legais
    zip.file("politica-privacidade.html", privacyPolicy);
    zip.file("termos-uso.html", termsOfService);
    
    // Criar pasta para imagens
    const imgFolder = zip.folder("imagens");
    
    // Adicionar imagem de fundo do hero se fornecida
    if (heroImage) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(heroImage);
      
      const imageArrayBuffer = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      
      imgFolder.file("hero-bg.jpg", imageArrayBuffer);
    } else {
      // Poderia adicionar uma imagem padrão se não for fornecida
    }
    
    // Gerar o arquivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return zipBlob;
  } catch (error) {
    console.error("Erro ao criar arquivo ZIP:", error);
    throw error;
  }
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