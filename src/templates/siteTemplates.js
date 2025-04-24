// Exemplo de estrutura
export const siteTemplates = [
  {
    id: "template1",
    name: "Moderno",
    colors: ["#1a2b3c", "#ffffff", "#e0e0e0", "#4CAF50"], // Cor primária, fundo, cinza claro, destaque
    fonts: {
      heading: "'Montserrat', sans-serif",
      body: "'Open Sans', sans-serif"
    },
    animations: ["fade", "slide"],
    layout: "wide",
    cardStyle: "shadow",
    heroStyle: "centered"
  },
  {
    id: "template2",
    name: "Clássico",
    colors: ["#2c3e50", "#ecf0f1", "#bdc3c7", "#3498db"],
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Lato', sans-serif"
    },
    animations: ["zoom", "bounce"],
    layout: "boxed",
    cardStyle: "border",
    heroStyle: "leftAligned"
  },
  {
    id: "template3",
    name: "Minimalista",
    colors: ["#121212", "#ffffff", "#f5f5f5", "#ff6b6b"],
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Roboto', sans-serif"
    },
    animations: ["fade", "reveal"],
    layout: "wide",
    cardStyle: "flat",
    heroStyle: "fullScreen"
  },
  // Adicione mais templates com diferentes combinações
];