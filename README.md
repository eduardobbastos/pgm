# Portal de Inteligência Artificial | PGM-RJ

Este repositório centraliza os cursos e conteúdos sobre Inteligência Artificial da **Procuradoria Geral do Município do Rio de Janeiro**, integrando as frentes Jurídica e Administrativa em um portal unificado e moderno.

## 🏗️ Estrutura do Projeto

O projeto é organizado de forma modular para facilitar a manutenção e a expansão dos conteúdos:

- `/`: Raiz do projeto com a página de entrada (`index.html`).
- `pgm_juridico/`: Curso de IA Aplicada à Atividade Jurídica.
- `pgm_administrativo/`: Curso de IA Estratégica para Gestão e Processos Administrativos.
- `assets/`: Recursos compartilhados (CSS, JS, Módulos). *Nota: Cada curso possui sua própria pasta assets para manter a independência.*

## 📄 Gerenciamento de Conteúdo (Markdown)

Diferente das versões anteriores que utilizavam Google Sheets ou CSV, o portal agora utiliza **Markdown (`.md`)** como fonte de dados. Isso permite:
- Edição simplificada do conteúdo.
- Controle de versão completo via Git.
- Funcionamento offline e maior performance.

### Como editar o conteúdo:
Localize o arquivo `meta_dados.md` dentro da pasta do respectivo curso.
1. **Metadados (Frontmatter)**: Edite as informações entre os marcadores `---` no topo do arquivo (Curso, Objetivo, Professores).
2. **Aulas**: Use o cabeçalho `# Aula X: Título` para definir uma nova aula. Todo o texto abaixo do cabeçalho será interpretado como o conteúdo daquela aula, suportando formatação Markdown.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, Vanilla CSS3, Javascript (ES6 Modules).
- **Ícones**: [Lucide Icons](https://lucide.dev/).
- **Tipografia**: Google Fonts (Inter e Outfit).
- **Data Source**: Markdown dinâmico processado via `DataService.js`.

## 🚀 Como Executar

Por utilizar módulos ES6, o projeto precisa ser servido via servidor web (mesmo que local).
- **VS Code**: Use a extensão "Live Server".
- **Terminal (Python)**: `python3 -m http.server 8000` na raiz do projeto.
- **Terminal (Node)**: `npx serve .`

---
*Desenvolvido para o Programa de Valorização do Servidor - PGM-RJ.*
