export async function generateSite(formData) {
    // Construção do prompt para OpenAI
    const prompt = `
      Gere um site responsivo completo baseado nas seguintes informações:
      
      DADOS DA EMPRESA:
      - Nome: ${formData.empresa}
      - CNPJ: ${formData.cnpj}
      - Email: ${formData.email}
      ...
      
      REQUISITOS:
      - Use variações aleatórias de estilo mas mantenha a estrutura principal
      - Inclua efeitos visuais modernos
      - Garanta responsividade para todos dispositivos
    `;
    
    // Chamada para a API
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Você é um desenvolvedor web especializado em criar sites responsivos e atraentes."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao gerar site:", error);
      throw error;
    }
  }