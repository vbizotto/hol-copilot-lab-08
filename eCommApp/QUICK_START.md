# Guia de início rápido para desenvolvedores

Este guia explica como preparar, executar, testar e compilar localmente o **The Daily Harvest**, uma aplicação de loja virtual demonstrativa feita com React, TypeScript e Vite.

## Pré-requisitos

- **Node.js `^20.19.0` ou `>=22.12.0`**. Essa é a faixa exigida pela versão do Vite instalada no projeto.
- **npm**, incluído com o Node.js. O repositório contém `package-lock.json`; use npm para instalar exatamente as dependências registradas.
- **Git**, se precisar clonar o repositório.

Confira as versões instaladas:

```powershell
node --version
npm --version
```

> O README original mencionava Node.js 18+, mas isso não atende ao requisito do Vite 8 definido no lockfile.

## Instalar e iniciar localmente

Na raiz do repositório, entre na pasta da aplicação e instale as dependências:

```powershell
cd eCommApp
npm ci
```

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

O Vite está configurado para abrir o navegador automaticamente na porta `3000`. Se necessário, acesse [http://localhost:3000](http://localhost:3000). Para parar o servidor, pressione `Ctrl+C` no terminal.

## Comandos principais

Execute estes comandos a partir de `eCommApp`:

| Comando | O que faz |
| --- | --- |
| `npm ci` | Instala as dependências usando o lockfile. |
| `npm run dev` | Inicia o servidor local de desenvolvimento. |
| `npm run build` | Verifica os tipos com TypeScript e gera o build de produção em `dist/`. |
| `npm run preview` | Serve localmente o build de produção já gerado. |
| `npm run lint` | Executa o ESLint nos arquivos TypeScript e TSX. |
| `npm run test:run` | Executa os testes uma vez e termina. |
| `npm test` | Inicia o Vitest em modo interativo/watch. |
| `npm run test:ui` | Abre a interface do Vitest. |
| `npm run test:coverage` | Executa os testes e coleta cobertura com V8. |

Para executar um teste específico, por exemplo:

```powershell
npm run test:run -- src/components/CartPage.test.tsx
```

Uma verificação completa comum antes de enviar uma alteração:

```powershell
npm run lint
npm run test:run
npm run build
```

## Visão geral da aplicação

As rotas principais são:

| Rota | Página |
| --- | --- |
| `/` | Página inicial |
| `/products` | Catálogo de produtos e acesso às avaliações |
| `/cart` | Carrinho e confirmação simulada do pedido |
| `/login` | Formulário de login administrativo |
| `/admin` | Tela administrativa de promoção |

O fluxo de compra demonstrativo é: consultar o catálogo, adicionar produtos ao carrinho e confirmar o checkout. O estado do carrinho é mantido no contexto React enquanto a aplicação está em execução.

## Arquivos e pastas importantes

| Caminho | Responsabilidade |
| --- | --- |
| `src/main.tsx` | Ponto de entrada React; configura o roteador e monta a aplicação. |
| `src/App.tsx` | Declara as rotas e envolve as páginas com o provedor do carrinho. |
| `src/components/` | Páginas e componentes da interface, como catálogo, carrinho, login e modais. |
| `src/context/CartContext.tsx` | Estado compartilhado do carrinho e operações de adicionar/limpar itens. |
| `src/types/index.ts` | Tipos TypeScript compartilhados, incluindo produto e avaliação. |
| `public/products/*.json` | Dados de produto consumidos pelo catálogo. |
| `public/products/productImages/` | Imagens dos produtos. |
| `src/App.css` e `src/index.css` | Estilos da aplicação e estilos globais. |
| `src/components/*.test.tsx` | Testes dos componentes e páginas. |
| `src/test/setup.ts` | Configuração global do ambiente de testes. |
| `src/test/test-utils.tsx` | Renderizador de teste com roteador e contexto do carrinho. |
| `vite.config.ts` | Configura Vite, porta do servidor e Vitest (`jsdom`, setup e cobertura). |
| `tsconfig.json` | Configuração do TypeScript para o código da aplicação. |
| `package.json` | Scripts e dependências diretas do projeto. |
| `package-lock.json` | Versões exatas resolvidas das dependências npm. |

## Testes e ferramentas

- **Vitest** executa os testes.
- **React Testing Library** renderiza e consulta a interface dos componentes.
- **jest-dom** fornece asserções adicionais para elementos do DOM.
- **jsdom** simula o ambiente de navegador durante os testes.

Os testes ficam junto dos componentes, com nomes terminados em `.test.tsx`. O Vitest é configurado em `vite.config.ts` e carrega `src/test/setup.ts`.

## Observações sobre o protótipo

Este projeto é voltado a aprendizado e demonstração. O código atual não mostra integração com backend: os produtos vêm de arquivos JSON estáticos, o estado do carrinho é local à sessão da aplicação e o checkout é simulado. O login administrativo também usa credenciais fixas no código e não deve ser considerado autenticação segura para produção. A tela de promoção demonstra uma interface administrativa; não presuma que ela atualiza os preços exibidos no catálogo.
