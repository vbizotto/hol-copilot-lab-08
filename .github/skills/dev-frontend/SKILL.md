---
name: dev-frontend
description: "Use when implementing or changing the front end of this project: React components, pages, routes, state, TypeScript, CSS, responsive layouts, accessibility, or user-facing behavior in eCommApp."
---

# Desenvolvimento front-end

## Objetivo

Implementar e evoluir a interface do The Daily Harvest com mudanças coesas, tipadas, acessíveis e compatíveis com a arquitetura e os padrões existentes. Esta skill orienta o desenvolvimento de funcionalidades front-end; para criar ou investigar testes e regressões em profundidade, use a skill `qa-testing`.

## Quando usar

- Criar ou alterar páginas, componentes, modais, formulários e navegação.
- Implementar interações de interface, estados locais ou estado compartilhado.
- Ajustar estilos, responsividade, layout ou acessibilidade.
- Integrar a interface com os dados e tipos já usados pela aplicação.
- Corrigir um comportamento visual ou funcional no front-end.

## Contexto do projeto

- A aplicação fica em `eCommApp/`; execute os comandos npm a partir dessa pasta.
- Stack: React 18, TypeScript estrito, React Router, Vite e CSS.
- `src/main.tsx` configura `BrowserRouter` e monta `App`; `src/App.tsx` registra as rotas e envolve as páginas com `CartProvider`.
- Páginas e componentes ficam em `src/components/`; o estado compartilhado do carrinho fica em `src/context/CartContext.tsx`.
- Tipos compartilhados ficam em `src/types/`; funções reutilizáveis ficam em `src/utils/`.
- `src/index.css` define estilos globais; `src/App.css` concentra estilos da aplicação e dos componentes. Verifique os estilos existentes antes de introduzir novas convenções.
- Produtos são disponibilizados em JSON sob `public/products/`. Confirme o formato e o fluxo de carregamento existentes antes de alterar a integração.
- Os componentes costumam ter testes próximos com o padrão `*.test.tsx`; o Vitest usa jsdom, configuração em `vite.config.ts` e setup em `src/test/setup.ts`.

## Procedimento

1. **Investigue antes de editar:** identifique a rota, componente, tipos, contexto, estilos e testes envolvidos. Procure componentes e padrões existentes que possam ser reutilizados.
2. **Defina o comportamento esperado:** considere o fluxo completo da pessoa usuária, incluindo carregamento, sucesso, vazio, erro e limites relevantes para a funcionalidade.
3. **Mantenha responsabilidades claras:** componha componentes pequenos quando isso melhorar a compreensão; mantenha estado junto ao consumidor mais próximo e use contexto existente para estado compartilhado. Não crie abstrações ou dependências sem necessidade.
4. **Preserve a segurança de tipos:** aproveite os tipos compartilhados, modele dados e props explicitamente e trate valores opcionais. Não esconda problemas com `any`, assertions desnecessárias ou supressões de TypeScript.
5. **Integre-se à navegação existente:** use React Router e os providers já configurados. Evite duplicar providers ou mudar rotas e contratos que não fazem parte do requisito.
6. **Implemente estados visíveis e previsíveis:** ações devem comunicar seu resultado; formulários devem associar rótulos aos campos, validar entradas relevantes e apresentar mensagens compreensíveis. Erros não devem ser ocultados nem transformados em sucesso.
7. **Cuide de acessibilidade e responsividade:** use elementos HTML semânticos, nomes acessíveis, foco e teclado funcionais, contraste legível e layouts que se adaptem a telas menores. Não dependa exclusivamente de cor ou hover para comunicar informação ou ação.
8. **Siga o estilo existente:** preserve convenções de nomes, formatação, CSS e organização local. Evite estilos globais novos quando uma regra de componente existente for suficiente.
9. **Valide a alteração:** rode `npm run build` e `npm run lint` para mudanças de produção; execute também os testes afetados com `npm run test:run -- caminho/do/arquivo.test.tsx`. Amplie as verificações conforme o alcance da mudança.
10. **Relate o resultado:** resuma a mudança, as verificações executadas e eventuais limitações ou decisões necessárias.

## Comandos do projeto

Execute em `eCommApp`:

```powershell
npm run lint
npm run build
npm run test:run -- src/components/NomeComponente.test.tsx
```

## Critérios de conclusão

- A interface atende ao comportamento solicitado e mantém os fluxos existentes que não foram alvo da mudança.
- A implementação segue a arquitetura e os tipos do projeto sem duplicação desnecessária.
- Estados importantes, acessibilidade básica e comportamento em telas menores foram considerados.
- Build, lint e testes pertinentes foram executados; falhas e limitações são informadas com precisão.
