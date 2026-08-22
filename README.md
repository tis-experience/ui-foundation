# UI Foundation

Biblioteca React independente, baseada em shadcn e Base UI. Ela oferece um tema neutro próprio e permite aplicar a identidade TIS como preset opcional — sem importar, estender ou depender do projeto `ds-tis`.

Esta versão é um alpha público e source-first: os componentes entram no projeto consumidor como código auditável por meio do registry do shadcn.

O registry é a distribuição do produto. O package do repositório permanece `private` para npm e não oferece um pacote runtime monolítico.

Catálogo público: [tis-experience.github.io/ui-foundation](https://tis-experience.github.io/ui-foundation/)

## O que já funciona

- 66 componentes instaláveis do registry, incluindo Data Table, Date Picker, Form e Typography;
- comportamento acessível fornecido por Base UI 1.7.0;
- tema Neutral como padrão, com modos Light e Dark;
- preset TIS opcional, também com Light e Dark;
- perfis de densidade Compact, Comfortable e Spacious, com Comfortable como padrão;
- foundations explícitas para tipografia, spacing, radius, borders, elevation, motion e foco;
- catálogo interativo com busca, filtros e exemplos reais;
- personalizador integrado de identidade, base neutra, brand, Charts, tipografia, radius, densidade e modo, com preview dos componentes reais;
- exportação do preset como CSS, `registry:theme` JSON ou URL compartilhável;
- 4 Blocks instaláveis: Dashboard Overview, Login Page, Settings Page e Team Members;
- 6 receitas instaláveis de Charts: Area, Bar, Line, Pie, Radar e Radial;
- instalação validada em um projeto React/Vite limpo;
- manifesto estruturado e instruções para agentes de IA.

## Consultar ou executar o catálogo

O catálogo público está disponível em:

```text
https://tis-experience.github.io/ui-foundation/
```

Para executar localmente:

```bash
npm install
npm run dev
```

O catálogo local abre em `http://127.0.0.1:4310/` quando iniciado com a porta usada neste trabalho.

As áreas principais são Components, Blocks, Charts, Customize, Foundations e Tokens.

## Instalar um componente

Um consumidor pode instalar código-fonte diretamente do registry público pela CLI do shadcn:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/button.json
```

O caminho `/r` acompanha a versão mais recente publicada. Releases formais usam URLs imutáveis em `/releases/<version>/r/<item>.json`, acompanhadas por manifesto SHA-256. Consulte [docs/installation.md](docs/installation.md) e [docs/releases.md](docs/releases.md).

Para aplicar a identidade TIS, instale também o preset e selecione-o no elemento raiz:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/theme-tis.json
```

```html
<html data-ui-theme="tis">
```

O modo Dark é ativado com `class="dark"` no mesmo elemento. Sem `data-ui-theme`, a aplicação usa Neutral.

A densidade é independente da identidade. Comfortable é o padrão; Compact e Spacious são ativadas no mesmo elemento raiz:

```html
<html data-ui-theme="tis" data-ui-density="comfortable">
```

As alturas `sm / md / lg` são 28 / 32 / 36px em Compact, 32 / 40 / 48px em Comfortable e 40 / 48 / 56px em Spacious.

## Personalizar e exportar

Abra `/#customize` para editar tema, fonts, ritmo de Typeset, radius, chart palette e densidade no mesmo fluxo. O preview usa os componentes reais da biblioteca. A interface permite ajustar size, leading, flow e measure, copiar CSS, copiar ou baixar um item shadcn `registry:theme` e compartilhar o preset por URL.

O contrato reproduzível está em `tokens/customizer.json`. Consulte [docs/customization.md](docs/customization.md).

## Blocks e Charts

Os Blocks são itens `registry:block`, compostos pelos componentes existentes e instalados como source editável. As receitas de Charts seguem o mesmo modelo e usam Recharts com os tokens `--chart-1` a `--chart-5`.

Consulte [docs/blocks.md](docs/blocks.md) e [docs/charts.md](docs/charts.md) para os comandos e contratos de uso.

## Arquitetura

```text
registry/catalog.json       catálogo canônico
        │
        ├── public/r/*.json código distribuído pelo shadcn
        ├── public/releases snapshots imutáveis e manifestos de integridade
        ├── public/ai/*     contrato machine-readable para IA
        └── src/catalog/*   catálogo humano e interativo

tokens/foundations.json     tipografia, spacing, radius, borders, elevation e motion
tokens/densities.json       perfis Compact, Comfortable e Spacious
tokens/customizer.json      opções, presets e saídas do personalizador
tokens/themes/neutral.json  tema padrão e modos de cor
tokens/themes/tis.json      identidade opcional e modos de cor

src/components/ui/*         componentes React + Base UI
src/blocks/*                application Blocks instaláveis
src/charts/*                receitas de Charts instaláveis
```

As fronteiras são intencionais:

- shadcn distribui e compõe o source;
- Base UI fornece primitives comportamentais;
- UI Foundation define tokens, aparência, contratos e documentação;
- o preset TIS é apenas um adaptador visual opcional.

Mais detalhes em [docs/architecture.md](docs/architecture.md), [ADR-001](docs/decisions/ADR-001-standalone-source-first.md) e [ADR-002](docs/decisions/ADR-002-density-and-focus-contract.md).

Para desenvolvimento e releases, consulte [Developer API](docs/developer-api.md), [Installation](docs/installation.md) e [Registry releases](docs/releases.md).

## Uso por IA

Uma IA deve ler, nesta ordem:

1. `public/ai/manifest.json` — componentes, exports, instalação e regras;
2. `public/llms.txt` — orientação compacta em texto;
3. `registry/catalog.json` — metadados do catálogo;
4. `tokens/foundations.json` — contrato compartilhado das foundations;
5. `tokens/densities.json` — escala ativa de altura, padding, gap, tipografia e ícones dos controles;
6. `tokens/customizer.json` — opções, defaults e saídas reproduzíveis do preset;
7. `docs/ai-usage.md` — processo para implementação e design assistido;
8. `docs/developer-api.md` e `docs/installation.md` — API source-first e instalação;
9. `docs/blocks.md` e `docs/charts.md` — padrões de aplicação e visualização instaláveis;
10. `docs/compositions.md` — uso das composições instaláveis;
11. o source real do componente, Block ou receita selecionada.

A IA deve gerar uma composição executável com componentes existentes, não inventar um handoff ou afirmar que existe uma biblioteca Figma.

## Qualidade

```bash
npm test              # geração, lint e build
npm run test:consumer # instalação real em consumidor limpo
npm run test:e2e      # interação, responsividade e WCAG/Axe
npm run release:dry-run       # ensaio isolado do snapshot versionado
npm run test:consumer:public  # smoke pós-deploy contra o registry hospedado
```

## Estado e limites

- versão: `0.1.0-alpha.0`;
- repositório e catálogo públicos no GitHub Pages;
- nenhum pacote npm por decisão arquitetural; a distribuição é o registry source-first;
- nenhum Figma criado nesta fase;
- nenhuma dependência do DS TIS atual;
- 66 componentes, 4 Blocks e 1 bundle com 6 receitas de Charts estão incorporados como source instalável.

## Licença

MIT. Consulte [LICENSE](LICENSE).
