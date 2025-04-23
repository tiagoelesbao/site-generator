export function extractFiles(response) {
    // Verifica se a resposta contém a propriedade esperada
    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Formato de resposta inválido da API OpenAI');
    }
    
    const content = response.choices[0].message.content;
    
    // Extrair HTML
    const htmlRegex = /```html\n([\s\S]*?)\n```/;
    const htmlMatch = content.match(htmlRegex);
    const htmlContent = htmlMatch ? htmlMatch[1] : '';
    
    // Extrair CSS
    const cssRegex = /```css\n([\s\S]*?)\n```/;
    const cssMatch = content.match(cssRegex);
    const cssContent = cssMatch ? cssMatch[1] : '';
    
    // Extrair JavaScript
    const jsRegex = /```javascript\n([\s\S]*?)\n```/;
    const jsMatch = content.match(jsRegex);
    const jsContent = jsMatch ? jsMatch[1] : '';
    
    // Se não conseguir extrair nenhum conteúdo, lança erro
    if (!htmlContent && !cssContent && !jsContent) {
      throw new Error('Não foi possível extrair os arquivos do site da resposta da API');
    }
    
    return { htmlContent, cssContent, jsContent };
  }