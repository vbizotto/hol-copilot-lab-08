---
name: qa-testing
description: "Use ao criar ou atualizar testes unitários, de componentes ou integração, investigar bugs e regressões, verificar cobertura, acessibilidade e qualidade da aplicação React/TypeScript deste projeto."
---

# QA e testes da aplicação

## Objetivo

Planejar e executar verificações confiáveis para a loja virtual React, reutilizando a configuração e os padrões de teste existentes. Entregue testes que validem comportamento observável, expliquem falhas com clareza e possam ser executados localmente.

## Quando usar

- Criar ou atualizar testes unitários, de componentes ou integração.
- Investigar uma falha, bug, regressão ou comportamento inesperado.
- Medir cobertura de um componente/arquivo ou da aplicação.
- Verificar estados de interface, fluxos do usuário, tratamento de erros ou acessibilidade.
- Revisar a qualidade e a manutenção de testes existentes.

## Contexto do projeto

- A aplicação fica em `eCommApp/`; execute os comandos npm a partir dessa pasta.
- Stack: React, TypeScript, Vite, Vitest, jsdom e React Testing Library.
- Os testes ficam próximos ao código e usam os padrões `*.test.tsx` e `*.test.ts`.
- A configuração do Vitest está em `eCommApp/vite.config.ts` e carrega `src/test/setup.ts`.
- Cobertura usa V8. A configuração global exige 80% para statements, branches, functions e lines.
- Há um renderizador compartilhado em `eCommApp/src/test/test-utils.tsx` que envolve componentes com `BrowserRouter` e `CartProvider`. Use-o quando esses providers forem apropriados; caso contrário, monte apenas os providers necessários, como `MemoryRouter` ou um contexto substituto.
- Ferramentas de teste disponíveis incluem `@testing-library/user-event`, `@testing-library/jest-dom` e `vi` do Vitest.

## Procedimento

1. **Entenda o comportamento:** leia a implementação, os tipos, os testes próximos, os componentes relacionados e as configurações relevantes. Traduza o pedido em resultados que uma pessoa usuária possa observar.
2. **Escolha o nível adequado:** teste uma função isolada diretamente; teste interações e renderização com React Testing Library; teste integração entre módulos apenas quando a interação for parte do requisito.
3. **Reaproveite padrões:** verifique `src/test/test-utils.tsx`, fixtures e mocks existentes antes de criar novos helpers. Evite duplicar wrappers, dados ou lógica de preparação sem necessidade.
4. **Cubra cenários relevantes:** considere caminho principal, estados de carregamento/vazio, limites e validação, ações do usuário, dependências externas e falhas recuperáveis. Não crie casos especulativos sem relação com o requisito.
5. **Escreva testes legíveis:** use nomes descritivos, uma responsabilidade principal por teste e a sequência preparar–executar–verificar (Arrange–Act–Assert). Separe cenários quando isso facilitar identificar a causa de uma falha.
6. **Verifique pela interface:** prefira consultas acessíveis como `getByRole`, `findByRole` e `getByLabelText`. Confirme textos, estados e ações que uma pessoa usuária percebe, evitando depender de detalhes internos ou seletores CSS, exceto quando necessário.
7. **Controle dependências externas:** faça stub de respostas determinísticas (por exemplo, `fetch`) e use mocks para confirmar interações relevantes (por exemplo, inclusão no carrinho). Não chame serviços reais em testes unitários/componentes. Limpe ou restaure mocks, timers e spies após o teste.
8. **Teste falhas explicitamente:** ao simular rejeições, respostas HTTP malsucedidas ou dados inválidos, verifique o tratamento esperado e que erros não sejam ocultados. Se o código registra erros, silencie `console.error` somente durante o teste e valide a chamada esperada.
9. **Considere acessibilidade e estabilidade:** prefira rótulos acessíveis e eventos de usuário; aguarde operações assíncronas com `findBy...` ou `waitFor`; evite sleeps arbitrários e testes dependentes de ordem, rede ou relógio real.
10. **Rode verificações direcionadas:** comece pelo arquivo de teste alterado; amplie para a suíte, lint e build se a mudança afetar mais áreas.
11. **Reporte com precisão:** informe comandos executados, resultado, cobertura no escopo solicitado e limitações. Distinga falha dos testes focados de falha de cobertura global.

## Comandos do projeto

Execute na pasta `eCommApp`:

```powershell
# Executar todos os testes uma vez
npm run test:run

# Executar um arquivo de teste
npm run test:run -- src/components/NomeComponente.test.tsx

# Coletar cobertura de toda a aplicação
npm run test:coverage

# Medir cobertura somente de um arquivo/componente
npm run test:coverage -- --coverage.include=src/components/NomeComponente.tsx src/components/NomeComponente.test.tsx

# Verificações complementares
npm run lint
npm run build
```

O comando de cobertura global aplica os limites configurados a todo o código incluído, não apenas ao teste selecionado. Para uma solicitação de cobertura total de um componente, use o filtro direcionado e confirme os percentuais de statements, branches, functions e lines para esse arquivo.

## Critérios de conclusão

- Os testes correspondem ao requisito e seguem os padrões do repositório.
- Casos assíncronos e dependências externas são determinísticos e isolados.
- O arquivo de teste direcionado passa; verificações adicionais são executadas conforme o alcance da mudança.
- A cobertura é reportada para o escopo correto, sem confundir o relatório global com o focalizado.
- A resposta final resume cenários cobertos, validações executadas e qualquer falha ou limitação.

## Princípios de manutenção

- Não imponha exatamente uma asserção por teste: mantenha juntas as verificações que pertencem ao mesmo cenário e divida as independentes.
- Evite mocks excessivos; prefira comportamento real quando for leve e controlável.
- Mantenha dados de teste mínimos, explícitos e válidos segundo os tipos do projeto.
- Não aumente a cobertura apenas para atingir um percentual: teste caminhos e resultados significativos.
- Não altere código de produção só para facilitar um teste sem confirmar que a mudança melhora o desenho ou corrige um problema real.
