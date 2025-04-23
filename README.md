# 🚀 Gerador de Sites

Este projeto é um gerador automatizado de sites que utiliza IA para criar sites profissionais com base nas informações fornecidas pelo usuário.

## 📋 Funcionalidades

- Formulário completo para coleta de dados da empresa
- Geração automatizada de código HTML, CSS e JavaScript
- Criação de documentos legais (Política de Privacidade e Termos de Uso)
- Download do site completo em formato ZIP
- Templates responsivos e modernos
- Personalização de conteúdo

## 🛠️ Tecnologias Utilizadas

- React 19.1.0
- JSZip (para compactação de arquivos)
- OpenAI API (para geração do código)

## ⚙️ Configuração

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/gerador-de-sites.git
cd gerador-de-sites
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a API da OpenAI:

Crie um arquivo `.env` na raiz do projeto com sua chave de API:

```
REACT_APP_OPENAI_API_KEY=sua-chave-openai-aqui
```

4. Inicie o projeto:

```bash
npm start
```

## 🧩 Estrutura do Projeto

```
site-generator/
├── src/
│   ├── components/            # Componentes React
│   │   ├── Form.js            # Formulário principal
│   │   ├── FormField.js       # Campo de formulário reutilizável
│   │   └── DownloadButton.js  # Botão de download
│   ├── templates/             # Templates para documentos
│   │   ├── privacyTemplate.js # Template de política de privacidade
│   │   └── termsTemplate.js   # Template de termos de uso
│   ├── utils/                 # Utilitários
│   │   ├── generateSite.js    # Geração do site via API
│   │   ├── fileGenerator.js   # Extração dos arquivos
│   │   └── zipCreator.js      # Criação do arquivo ZIP
│   ├── styles/                # Arquivos CSS
│   └── App.js                 # Componente principal
├── public/                    # Arquivos públicos
└── package.json               # Dependências
```

## 🔧 Soluções para Problemas Comuns

### Erro ao Gerar o Site

Se você encontrar o erro "Ocorreu um erro ao gerar o site":

1. Verifique se sua chave de API da OpenAI está configurada corretamente no arquivo `.env`
2. Certifique-se de ter conexão com a internet
3. Verifique se sua chave API tem saldo disponível

### Formulário Incompleto

Se você não conseguir gerar o site por causa de campos obrigatórios:

1. Preencha pelo menos o "Nome da Empresa" e o "Título Principal"
2. Recomendamos preencher todos os campos para um site mais completo

## 🚧 Melhorias Planejadas para Versões Futuras

- [ ] Adicionar mais templates
- [ ] Integração com hospedagem automatizada
- [ ] Editor visual para personalização
- [ ] Suporte a múltiplos idiomas
- [ ] Otimização SEO automática
- [ ] Integração com Google Analytics

## 📜 Licença

Este projeto está licenciado sob a licença ISC.

## 📞 Contato

Para suporte ou dúvidas, entre em contato conosco pelo email: contato@geradordesites.com