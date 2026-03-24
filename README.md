# 🚀 Nest.js Backend Template

![NestJS](https://img.shields.io/badge/NestJS-11.0.0-red?style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-UNLICENSED-green?style=for-the-badge)

Um template robusto e pré-configurado para o desenvolvimento de aplicações backend com Nest.js, focado em produtividade, qualidade de código e automação.

---

## 🛠️ Primeiros Passos (Uso do Template)

Se você acabou de criar um repositório usando este template, siga estes passos para inicializar o seu novo projeto:

1. **Clone o repositório**:

   ```bash
   git clone <url-do-seu-repositorio>
   cd <nome-do-projeto>
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Inicialize o template**:
   Execute o script de inicialização para configurar o projeto (atualiza `package.json`, remove arquivos de exemplo e prepara o ambiente):
   ```bash
   npm run init
   ```

---

## ⚙️ Preparação Manual (Clone Direto)

Caso você esteja apenas clonando para estudo ou uso manual, siga estes passos:

1. **Instale as dependências**:

   ```bash
   npm install
   ```

2. **Rode o servidor em modo desenvolvimento**:

   ```bash
   npm run start:dev
   ```

3. **Formatação de Código**:
   O projeto já vem com Husky e lint-staged configurados. Para formatar manualmente:
   ```bash
   npm run format
   ```

---

## ✨ Sobre este Template

Este template foi projetado para seguir as melhores práticas atuais do ecossistema Nest.js e fornecer uma base sólida para APIs e microserviços.

### O que está incluso:

- **Nest.js (Backend)**: Estrutura modular pronta para APIs REST/GraphQL e microserviços.
- **TypeScript**: Tipagem forte para maior segurança e produtividade.
- **Qualidade de Código**:
  - **ESLint** com configuração moderna e suporte a TypeScript.
  - **Prettier** para estilo de código consistente.
  - **Commitlint** para validar mensagens de commit seguindo [Conventional Commits](https://www.conventionalcommits.org/).
- **Automação de Git (Husky)**:
  - Validação de lint + formatação no `pre-commit`.
  - Validação de mensagem no `commit-msg`.
  - Verificação de build no `pre-push`.
- **Scripts úteis**:
  - `npm run build` — compilação TypeScript.
  - `npm run test` — executa os testes Jest.
  - `npm run lint` — executa ESLint em todo o código.

### Diretrizes do Projeto

Para manter consistência no projeto, siga as convenções de arquitetura e estilo já presentes no código.

---

Desenvolvido com ❤️ para acelerar o seu próximo backend em Nest.js.
