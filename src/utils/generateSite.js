export async function generateSite(formData) {
  // Aqui você usaria a chave da API real do seu arquivo .env
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  // Construir o prompt completo para o OpenAI
  const prompt = `
    Você é um desenvolvedor web profissional. Crie um site institucional completo baseado nas seguintes informações:
    
    DADOS DA EMPRESA:
    - Nome: ${formData.empresa || 'Nome da Empresa'}
    - Razão Social: ${formData.razaoSocial || formData.empresa || 'Razão Social'}
    - CNPJ: ${formData.cnpj || 'XX.XXX.XXX/XXXX-XX'}
    - Endereço: ${formData.endereco || 'Endereço da empresa'}
    - Email: ${formData.email || 'contato@exemplo.com'}
    - Email LGPD: ${formData.emailLGPD || formData.email || 'lgpd@exemplo.com'}
    - Telefone: ${formData.telefone || '(XX) XXXX-XXXX'}
    - Domínio: ${formData.dominio || 'exemplo.com.br'}
    
    CONTEÚDO PRINCIPAL:
    - Título principal: ${formData.tituloHero || 'Bem-vindo à nossa empresa'}
    - Subtítulo: ${formData.subtituloHero || 'Soluções inovadoras para o seu negócio'}
    - Background do hero: Usar "hero-bg.jpg"
    
    SERVIÇOS:
    1. ${formData.servico1Nome || 'Serviço 1'} - ${formData.servico1Desc || 'Descrição do serviço 1'}
    2. ${formData.servico2Nome || 'Serviço 2'} - ${formData.servico2Desc || 'Descrição do serviço 2'}
    3. ${formData.servico3Nome || 'Serviço 3'} - ${formData.servico3Desc || 'Descrição do serviço 3'}
    
    QUEM SOMOS:
    ${formData.quemSomos || 'Breve texto sobre a empresa e sua história, missão, visão e valores.'}
    
    REQUISITOS:
    - Crie três arquivos separados: HTML, CSS e JavaScript
    - O site deve ser responsivo e moderno
    - Use uma paleta de cores aleatória mas harmoniosa
    - Inclua menus de navegação, seção hero com título e subtítulo, área de serviços, seção "quem somos" e rodapé
    - Adicione animações sutis e efeitos de transição
    - Crie um formulário de contato simples
    - Inclua links para "Política de Privacidade" e "Termos de Uso" no rodapé
    - O código deve ser bem estruturado e comentado
    - Garanta que cada geração seja única, alterando estilos, cores e animações
    - O design deve ser profissional e alinhado com as tendências atuais de web design
    
    Por favor, forneça o código completo em três blocos separados com os seguintes formatos:
    1. Código HTML em um bloco \`\`\`html
    2. Código CSS em um bloco \`\`\`css
    3. Código JavaScript em um bloco \`\`\`javascript
  `;
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um desenvolvedor web especializado em criar sites responsivos, modernos e atraentes. Seu código é limpo, bem estruturado e segue as melhores práticas de desenvolvimento web."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro ao gerar site:", error);
    throw error;
  }
}