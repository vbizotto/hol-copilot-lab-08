# Guia prático: skills eficientes para GitHub Copilot

## Objetivo

Este guia mostra como criar skills reutilizáveis para evitar repetir instruções em cada solicitação e reduzir o contexto desnecessário enviado ao Copilot. Os exemplos cobrem estruturação de projetos, desenvolvimento, testes, CI/CD e qualidade.

Uma skill é um fluxo de trabalho especializado que o agente pode carregar quando a tarefa pede aquela experiência. Ela é diferente de uma instrução global: a skill deve conter conhecimento útil para um tipo específico de trabalho, e não regras que precisam aparecer em toda conversa.

## 1. Escolha a personalização certa

Antes de criar uma skill, identifique onde a regra deve morar:

| Necessidade | Recurso recomendado | Exemplo |
| --- | --- | --- |
| Regra importante em praticamente toda alteração | `.github/copilot-instructions.md` | Linguagem, comandos de teste padrão e restrições gerais do repositório |
| Orientação que se aplica a determinados arquivos | `*.instructions.md` com `applyTo` | Convenções específicas para `src/**/*.tsx` |
| Procedimento repetível e especializado, acionado quando necessário | Skill `SKILL.md` | Analisar arquitetura, implementar uma funcionalidade ou preparar CI |
| Pedido pontual com parâmetros fornecidos pelo usuário | Prompt `*.prompt.md` | Gerar release notes para uma versão |
| Agente com papel, ferramentas ou contexto próprio | Agente `*.agent.md` | Revisor de código sem permissão de edição |
| Ação determinística automática em eventos do agente | Hook | Executar formatador depois de uma edição |

**Regra prática:** coloque nas instruções globais o mínimo indispensável para quase todo trabalho. Coloque procedimentos específicos em skills e carregue-os somente quando forem relevantes.

## 2. Organize skills por resultado, não por cada tecnologia

Uma skill deve representar uma tarefa reconhecível, com início, passos e resultado verificável. Evite criar uma skill para cada biblioteca, comando ou convenção pequena: isso aumenta a manutenção e torna mais difícil escolher a skill certa.

Para um projeto de software, uma coleção inicial enxuta pode ser:

| Skill sugerida | Quando usar | Inclua |
| --- | --- | --- |
| `project-architecture` | Criar um projeto, entender sua estrutura ou planejar uma mudança transversal | Descoberta do repositório, limites entre módulos, dependências e plano de mudança |
| `feature-development` | Implementar ou corrigir comportamento de uma aplicação | Convenções locais, desenho da solução, implementação, erros e documentação |
| `testing-quality` | Criar ou atualizar testes, medir cobertura ou revisar qualidade | Estratégia de testes, fixtures, mocks, cobertura, análise estática e verificações |
| `ci-cd-workflows` | Criar, alterar ou diagnosticar automações de integração e entrega | Pipeline, qualidade, artefatos, segredos, ambientes, publicação e rollback |

Comece com poucas skills. Separe uma skill quando o fluxo, os gatilhos ou os recursos necessários forem realmente diferentes. Se duas skills são quase sempre carregadas juntas e repetem os mesmos passos, considere consolidá-las.

## 3. Estrutura e localização dos arquivos

Para skills compartilhadas com a equipe e versionadas com o repositório, use:

```text
.github/
└── skills/
    ├── project-architecture/
    │   ├── SKILL.md
    │   └── references/
    │       └── architecture-checklist.md
    ├── feature-development/
    │   └── SKILL.md
    ├── testing-quality/
    │   ├── SKILL.md
    │   └── references/
    │       └── testing-strategy.md
    └── ci-cd-workflows/
        └── SKILL.md
```

Use o diretório pessoal de skills se o fluxo for preferência individual e não regra compartilhada. Para uma equipe, mantenha as skills dentro do repositório.

Cada diretório de skill precisa ter um `SKILL.md`. O nome no frontmatter deve corresponder ao nome da pasta. O arquivo deve ser autocontido para o fluxo principal; materiais extensos podem ficar em `references/`, exemplos em `assets/` e automações executáveis em `scripts/`.

## 4. Frontmatter e descrição: como tornar a skill fácil de encontrar

Exemplo mínimo:

```markdown
---
name: testing-quality
description: "Use ao criar ou atualizar testes, investigar falhas, avaliar cobertura ou revisar qualidade de código neste projeto."
---

# Testes e qualidade

## Procedimento
1. ...
```

Boas práticas:

- Use `name` curto, em letras minúsculas, números e hífens; ele deve corresponder ao nome da pasta.
- Escreva a `description` como um gatilho: diga **quando** usar a skill e use termos que as pessoas realmente empregam nos pedidos.
- Seja específico. “Ajuda com código” não distingue essa skill das demais.
- Inclua as atividades abrangidas e o contexto do projeto, sem listar palavras-chave irrelevantes.
- Mantenha o corpo principal focado no fluxo de trabalho. Consulte referências somente quando um passo precisar delas.
- Prefira caminhos relativos dentro da skill, por exemplo `[estratégia de testes](./references/testing-strategy.md)`.

## 5. Modelo reutilizável de `SKILL.md`

Use este esqueleto e substitua as instruções entre colchetes:

```markdown
---
name: nome-da-skill
description: "Use quando [gatilhos e tarefas específicas] neste projeto."
---

# [Resultado que a skill entrega]

## Objetivo
[Descreva o resultado esperado em uma ou duas frases.]

## Quando usar
- [Pedido ou situação que ativa a skill.]
- [Outro gatilho relevante.]

## Procedimento
1. Inspecione [arquivos, configurações ou padrões existentes] antes de propor mudanças.
2. Identifique [requisitos, dependências e comportamento que deve ser preservado].
3. Execute [passos específicos do fluxo].
4. Atualize [testes e documentação relacionados].
5. Rode [comandos de validação existentes no projeto].
6. Informe mudanças, validações e limitações.

## Critérios de conclusão
- [Resultado verificável.]
- [Verificação executada e resultado esperado.]

## Recursos
- Consulte [referência](./references/nome.md) quando [condição].
```

Não mantenha seções vazias. Para skills pequenas, omita seções desnecessárias.

## 6. O que colocar em cada skill

### 6.1 Estruturação e arquitetura do projeto

**Gatilhos típicos:** iniciar um projeto, entender o repositório, organizar pastas, avaliar limites entre módulos, propor uma refatoração ampla ou planejar uma mudança que atravessa camadas.

**A skill deve orientar o agente a:**

1. Ler a estrutura, os arquivos de entrada, os manifests e a documentação antes de sugerir arquitetura.
2. Identificar linguagem, frameworks, ferramentas de build, testes e convenções já adotadas.
3. Explicar responsabilidades dos módulos e a direção permitida das dependências.
4. Procurar padrões existentes para reutilizar em vez de criar uma segunda solução.
5. Distinguir uma necessidade real de arquitetura de uma abstração prematura.
6. Para projetos novos, propor primeiro uma estrutura mínima e justificar diretórios e dependências.
7. Para mudanças transversais, enumerar superfícies afetadas, compatibilidade, migração e riscos.
8. Documentar decisões arquiteturais duradouras no local adotado pelo projeto.

**Não coloque aqui:** o passo a passo de toda implementação de funcionalidade. Depois de esclarecer a arquitetura, a skill de desenvolvimento pode executar a mudança.

**Exemplo de critérios de conclusão:**

- Cada módulo novo tem uma responsabilidade clara.
- As dependências seguem as regras arquiteturais documentadas.
- A proposta considera os padrões e ferramentas existentes.
- A documentação de arquitetura foi atualizada quando a decisão afeta a equipe.

### 6.2 Desenvolvimento e manutenção

**Gatilhos típicos:** implementar funcionalidade, corrigir bug, refatorar um módulo, alterar uma API ou atualizar uma interface.

**A skill deve orientar o agente a:**

1. Reproduzir o pedido em critérios de aceitação observáveis.
2. Ler o código relacionado, seus chamadores, tipos, configurações e testes antes de editar.
3. Procurar helpers e padrões existentes; evitar duplicação e mudanças fora do escopo.
4. Planejar a mudança mínima completa e identificar comportamento que precisa ser preservado.
5. Implementar com os tipos, nomes, formatação, acessibilidade e tratamento de erros do projeto.
6. Não ocultar falhas com valores padrão silenciosos ou capturas genéricas.
7. Atualizar testes e documentação diretamente relacionados à mudança.
8. Rodar validações direcionadas e apresentar claramente o que passou ou falhou.

**Exemplo de instrução concisa para uma skill:**

```markdown
Antes de editar, leia a implementação e os testes próximos. Reutilize os padrões
existentes. Faça uma alteração cirúrgica que satisfaça os critérios de aceitação,
inclua tratamento explícito de falhas e valide o fluxo com os testes relevantes.
```

### 6.3 Testes e qualidade

**Gatilhos típicos:** criar ou atualizar testes, investigar uma regressão, validar uma correção, avaliar cobertura, executar lint ou revisar uma alteração.

**A skill deve orientar o agente a:**

1. Identificar o comportamento público e os casos importantes, incluindo entradas inválidas e falhas.
2. Ler os testes existentes e imitar as ferramentas, fixtures e convenções locais.
3. Escrever testes com nomes descritivos e uma responsabilidade principal por teste.
4. Usar a estrutura preparar–executar–verificar (Arrange–Act–Assert) quando deixar o teste mais claro.
5. Preferir dependências reais leves; usar stub para respostas predeterminadas e mock quando for necessário verificar interações.
6. Evitar testar detalhes internos que podem mudar sem alteração de comportamento.
7. Tornar cenários assíncronos determinísticos e limpar mocks, timers e recursos.
8. Medir a cobertura do arquivo ou comportamento solicitado; não confundir cobertura global com cobertura de um único componente.
9. Usar os comandos existentes para testes, tipos, lint e build, começando pela verificação mais focada.
10. Ao revisar, priorizar bugs reproduzíveis, regressões e riscos concretos, com arquivo, linha e impacto.

**Não imponha “uma única asserção por teste” como regra absoluta.** Várias verificações relacionadas podem formar um único cenário; divida quando asserções independentes tornarem a causa de uma falha difícil de entender.

**Exemplo de critérios de conclusão:**

- Os novos testes reproduzem o comportamento solicitado e cobrem os caminhos relevantes.
- O teste falha quando o comportamento está errado e passa quando está correto.
- A suíte focada, a análise estática e/ou o build foram executados conforme aplicável.
- A cobertura reportada corresponde exatamente ao escopo solicitado.

### 6.4 CI/CD e entrega

**Gatilhos típicos:** criar ou alterar workflows, acelerar pipeline, adicionar gates, publicar artefatos, configurar ambientes ou investigar falha de CI/CD.

**A skill deve orientar o agente a:**

1. Inspecionar os workflows, scripts de build, configuração de branches e práticas de release existentes.
2. Separar validação de pull request, publicação de artefatos e implantação por ambiente.
3. Executar verificações reproduzíveis: instalação, lint, tipos, testes e build, conforme o projeto.
4. Usar versões e ações fixadas de acordo com a política do repositório; evitar permissões excessivas.
5. Usar segredos do ambiente seguro, nunca imprimir credenciais ou gravá-las no código/logs.
6. Definir condições explícitas para publicação e implantação, com proteção adequada para produção.
7. Preservar cache correto e artefatos versionados; não tornar o pipeline “verde” ignorando falhas.
8. Considerar cancelamento de execuções obsoletas, concorrência e execução em forks quando aplicável.
9. Para implantação, definir aprovação, estratégia de rollback e como verificar que o serviço ficou saudável.
10. Validar sintaxe e execução do workflow com as ferramentas disponíveis e explicar limites de validação local.

**Exemplo de estágios de pipeline:**

```text
pull request: instalar → lint/tipos → testes → build
merge na branch de release: repetir validações → empacotar artefato
implantação: aprovação/ambiente protegido → deploy → verificação de saúde
```

Os nomes e a ordem devem seguir as ferramentas reais do projeto; não copie um pipeline genérico sem verificar o repositório.

## 7. Economize tokens com carregamento progressivo

O contexto da skill é útil, mas também consome tokens. Reduza esse custo da seguinte forma:

1. **Mantenha a descrição curta e informativa.** Ela precisa permitir descobrir a skill, não explicar todo o procedimento.
2. **Coloque somente o fluxo principal em `SKILL.md`.** Como referência prática, mantenha-o compacto e abaixo do limite documentado pela ferramenta utilizada.
3. **Mova matrizes, exemplos extensos e detalhes específicos para `references/`.** Instrua quando consultar cada arquivo.
4. **Não copie o README inteiro para uma skill.** Aponte para a documentação e solicite leitura apenas quando necessária.
5. **Não repita instruções globais** como “seja claro” em todas as skills; deixe a regra global em um só lugar.
6. **Evite explicar o óbvio e repetir o mesmo checklist** em desenvolvimento, testes e CI. Defina responsabilidades e referências cruzadas.
7. **Não inclua exemplos de todas as linguagens** se o repositório usa uma só. Priorize comandos e ferramentas reais.
8. **Use scripts e templates** para material determinístico ou repetitivo, em vez de embutir grandes blocos de instruções em todas as conversas.
9. **Carregue dados do projeto sob demanda.** Por exemplo, a skill pode pedir para abrir o `package.json` e identificar os scripts em vez de copiar todos os comandos para cada arquivo.
10. **Revise skills obsoletas.** Remova passos que deixaram de corresponder ao código e consolide instruções duplicadas.

## 8. Como evitar solicitações repetidas

1. Transforme solicitações que se repetem em gatilhos na `description`.
2. Converta preferências estáveis da equipe em instruções globais ou de arquivos, conforme o escopo.
3. Converta processos com vários passos e resultado verificável em skills.
4. Inclua na skill os critérios de conclusão, as ferramentas e os caminhos que geralmente precisam ser inspecionados.
5. Faça com que a skill encontre configurações reais no projeto em vez de exigir que a pessoa repita versões, comandos ou estrutura.
6. Use uma única skill como fluxo principal e consulte outras apenas se houver uma necessidade distinta.
7. Não crie uma skill para substituir requisitos de cada tarefa. A pessoa ainda precisa informar o que quer construir e critérios específicos do produto.

### Exemplo: converter um pedido repetido em uma skill

**Pedido repetido:** “Crie os testes, inclua cenários de erro e rode a cobertura.”

**Melhoria:** a skill `testing-quality` define como localizar testes, criar cenários de sucesso e falha, limpar mocks e rodar a cobertura focada. Na próxima tarefa, a solicitação pode ser simplesmente: “Adicione testes para o fluxo de checkout”.

## 9. Ciclo recomendado de criação e manutenção

1. **Colete exemplos reais:** identifique solicitações repetidas, pontos de retrabalho e decisões recorrentes.
2. **Defina o escopo:** escreva em uma frase o resultado da skill e os pedidos que devem ativá-la.
3. **Escolha o recurso certo:** confirme que não se trata de uma regra sempre ativa, instrução por arquivo, prompt pontual ou hook.
4. **Escreva o menor fluxo completo:** inclua descoberta, execução, validação e comunicação do resultado.
5. **Acrescente referências somente quando necessário:** mantenha o `SKILL.md` rápido de consultar.
6. **Valide o frontmatter:** nome corresponde à pasta; descrição é concreta; YAML usa aspas quando a descrição contém pontuação ambígua.
7. **Teste com tarefas representativas:** peça ao Copilot uma tarefa que deve ativar a skill e outra que não deve ativá-la.
8. **Verifique o resultado:** avalie se o agente encontrou a skill, leu os arquivos corretos e evitou perguntas já respondidas pela documentação.
9. **Ajuste a descrição e o escopo:** resolva acionamentos falsos, skills não encontradas e conteúdo duplicado.
10. **Mantenha junto do projeto:** revise a skill quando mudarem scripts, arquitetura, CI ou padrões de teste.

## 10. Checklist antes de compartilhar uma skill

- [ ] O diretório está em `.github/skills/<nome>/` para ser compartilhado com o projeto.
- [ ] Existe um `SKILL.md` cujo `name` corresponde ao nome da pasta.
- [ ] A descrição diz claramente quando usar a skill e inclui os termos de busca prováveis.
- [ ] O fluxo tem passos acionáveis, não apenas recomendações genéricas.
- [ ] Os passos pedem inspeção do repositório e reutilização dos padrões existentes.
- [ ] A skill informa como validar e como reportar resultados ou limitações.
- [ ] As regras não duplicam desnecessariamente instruções globais ou outra skill.
- [ ] Referências são relativas, relevantes e abertas somente quando necessário.
- [ ] O conteúdo não depende de versões, comandos ou caminhos inventados.
- [ ] A skill foi testada com pelo menos um pedido representativo.

## Resumo

Para economizar tokens sem perder consistência, mantenha instruções globais pequenas, organize poucas skills por fluxo de trabalho, use descrições específicas para descoberta e mova detalhes extensos para referências carregadas sob demanda. No contexto de um projeto, comece com skills separadas para arquitetura, desenvolvimento, testes/qualidade e CI/CD; ajuste essa divisão quando o uso real mostrar sobreposição ou lacunas.
