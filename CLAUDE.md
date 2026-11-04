# CLAUDE.md — site-gustavopix

Portfólio pessoal de Gustavo Carvalho, hospedado no GitHub Pages. O projeto está passando por uma **refatoração completa de layout**. Este documento define a arquitetura-alvo, os tokens de design, as regras de layout e o roteiro de execução. Siga-o em todas as sessões de implementação.

---

## 1. Visão geral

- **SPA em Vue 3** (Composition API, `<script setup>`), uma única página composta por seções com âncoras.
- **Dados em JSON aberto** em `public/data/`, carregados via `fetch` no boot. Os JSON são copiados como estão para `dist/` e podem ser editados sem rebuild.
- **Nenhum texto hardcoded nos componentes.** Componentes apenas renderizam dados do JSON.
- **Bilíngue PT/EN.** Todo campo textual no JSON é `{ "pt": "...", "en": "..." }`.
- O Memocalc **não tem mais view própria**: vira um card na seção Projetos.

### Fonte da verdade visual: Penpot

- Arquivo: https://design.penpot.app/?screen=workspace&team-id=08b470c5-dda4-812a-8008-e4280bd9e510&file-id=c6f51e89-5d00-81ce-8008-e428489ebfa5&page-id=c6f51e89-5d00-81ce-8008-e428489ebfa6
- Board principal: `Board` (1920×5999), id `471269e3-ca1c-8002-8008-e428c6d7abe6`.
- Como consultar via MCP do Penpot:
  1. `high_level_overview` (uma vez por sessão).
  2. `execute_code` com `penpotUtils.shapeStructure(...)`, `penpotUtils.findShapeById(...)` e `penpot.generateStyle([shape], { type: "css", withChildren: true })` para ler valores.
  3. `export_shape` (id do board ou do grupo) para comparar visualmente cada seção implementada.
- Se o plugin responder "tab suspended", peça ao usuário para focar a aba do Penpot.

> **Importante:** o layout do Penpot **não tem formatação** (sem auto-layout, posições soltas, valores ímpares, alinhamentos inconsistentes). Use-o como referência de **hierarquia, cores, tipografia e composição**, nunca como fonte de pixels exatos. Alinhamento e espaçamento devem ser refeitos corretamente no código (ver seções 4 e 5).

### Referências visuais e de espaçamento

Consulte ao decidir ritmo vertical, largura de container, densidade e respiro:

- https://devhasibulislam.vercel.app/
- https://portfolio-sweandrew.vercel.app/
- https://cesargomez.dev/

O que extrair delas: container central com bastante margem, muito espaço em branco entre blocos, labels de seção pequenos em cor de destaque, cards com borda sutil e cantos arredondados, tipografia com hierarquia clara e poucas variações.

---

## 2. Stack e comandos

- **Vite** + `@vitejs/plugin-vue`, Vue 3, Sass, ESLint (`eslint-plugin-vue`).
- `vite.config.js`:
  - `base: './'` (caminhos relativos; funciona em `usuario.github.io/site-gustavopix/` e em domínio próprio).
  - alias `@` → `src`.
- Scripts:
  - `npm run dev` — servidor de desenvolvimento
  - `npm run build` — gera `dist/`
  - `npm run preview` — serve o build localmente (use para validar caminhos relativos)
  - `npm run lint`
- Deploy: `deploy.sh` permanece (build → `dist/` → push forçado para `gh-pages`).
- Os `fetch` de dados devem usar caminho relativo (`./data/site.json`) ou `import.meta.env.BASE_URL`, nunca `/data/...`.

---

## 3. Estrutura-alvo

```
index.html                         # raiz (padrão Vite), <title>Gustavo Carvalho</title>
vite.config.js
public/
  data/
    site.json                      # meta, nav, hero, sobre (texto + stats), contatos
    stacks.json                    # categorias e chips
    experiencias.json              # timeline
    projetos.json                  # intro + cards (inclui Memocalc)
  images/                          # mem01..04.png e futuras imagens de projetos
  favicon.ico
src/
  main.js
  App.vue                          # carrega dados, provê idioma, renderiza seções
  composables/
    useSiteData.js                 # fetch dos JSON, estado { data, loading, error }
    useLang.js                     # 'pt' | 'en', persiste em localStorage, t(campo)
  components/
    layout/AppHeader.vue
    ui/SectionLabel.vue
    ui/Chip.vue
    ui/PillButton.vue
    ui/Card.vue
  sections/
    HeroSection.vue
    SobreSection.vue
    StacksSection.vue
    ExperienciasSection.vue
    ProjetosSection.vue
    ContatosSection.vue
  styles/
    _tokens.scss                   # cores, tipografia, espaçamento, raios, breakpoints
    _reset.scss
    _mixins.scss                   # media queries, container
    main.scss
```

### Schemas JSON (exemplos)

`projetos.json`
```json
{
  "label": { "pt": "Projetos", "en": "Projects" },
  "intro": { "pt": "...", "en": "..." },
  "items": [
    {
      "id": "memocalc",
      "title": { "pt": "Memocalc", "en": "Memocalc" },
      "description": { "pt": "...", "en": "..." },
      "images": ["images/mem01.png", "images/mem02.png"],
      "links": [
        { "label": { "pt": "Visite", "en": "Visit" }, "url": "https://..." },
        { "label": { "pt": "Download", "en": "Download" }, "url": "https://..." }
      ]
    }
  ]
}
```

`experiencias.json`
```json
{
  "label": { "pt": "Experiências", "en": "Experience" },
  "items": [
    {
      "period": { "pt": "Janeiro 2020 - Presente", "en": "January 2020 - Present" },
      "role": { "pt": "Full Stack Developer", "en": "Full Stack Developer" },
      "company": "Empresa",
      "description": { "pt": "...", "en": "..." }
    }
  ]
}
```

`useLang` expõe `lang`, `setLang(l)` e `t(campo)`: se `campo` for string, retorna como está; se for objeto, retorna `campo[lang]` com fallback para `pt`.

---

## 4. Design tokens

Extraídos do Penpot e **normalizados para múltiplos de 2**. Defina-os todos em `_tokens.scss` como CSS custom properties; nenhum valor literal de cor, fonte ou espaçamento fora desse arquivo.

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#0F131A` | fundo da página e dos cards |
| `--color-surface` | `#242C38` | chips |
| `--color-primary-dark` | `#27354E` | borda do header, botões pill, botão de idioma |
| `--color-accent` | `#5779B6` | labels de seção, números das stats, timeline, marcadores |
| `--color-nav-pill` | `rgba(177, 178, 181, 0.25)` | fundo da navegação central |
| `--color-text` | `#FFFFFF` | texto principal |
| `--color-text-muted` | branco com opacidade | parágrafos secundários (confirmar opacidade no Penpot; garantir contraste ≥ 4.5:1) |
| `--color-border` | branco com opacidade baixa | borda 1px dos cards (confirmar no Penpot) |

### Temas

Três temas completos, trocados pelo conta-gotas do header (`ThemePicker.vue`, `useTheme.js`), aplicados via `<html data-theme>` e salvos em `localStorage`:

| Tema | `--color-bg` | `--color-surface` | `--color-primary-dark` | `--color-accent` |
|---|---|---|---|---|
| `midnight` (padrão, Penpot) | `#0F131A` | `#242C38` | `#27354E` | `#5779B6` |
| `dracula` | `#282A36` | `#343746` | `#44475A` | `#BD93F9` |
| `nord` | `#2E3440` | `#3B4252` | `#434C5E` | `#88C0D0` |

- As cores derivadas (`--color-bg-translucent`, `--color-accent-soft`, `--color-accent-line`) são calculadas com `color-mix`. Componentes nunca usam hex direto.
- Para adicionar um tema: bloco `[data-theme='x']` em `_tokens.scss`, id em `THEMES` (`useTheme.js`), item em `site.json > nav.themes` e em `fallback.js`, e as cores do loader no `<script>`/`<style>` do `index.html`.
- O header segue https://cesargomez.dev/: shell pill translúcido com `backdrop-filter`; borda branca a 12% e sombra só depois do scroll; links de 12px em maiúsculas.
- Menu na mesma ordem das seções do site. Uma "bolha" (`.header__bubble`) desliza até o link em hover ou da seção ativa, com `--ease-bounce` e um squash elástico (`bubble-squash`) a cada movimento.
- Fundo estrelado (`StarField.vue`), no estilo de https://devhasibulislam.vercel.app/: `<canvas>` fixo com `z-index: -1`. Cada estrela deriva numa direção aleatória (2–8px/s, reaparece do lado oposto) e cintila em intervalos aleatórios (1.5–9s). A densidade e os intervalos são constantes no topo do script. Com `prefers-reduced-motion`, as estrelas ficam estáticas.
- A vinheta radial (`transparent → --color-bg 80%`) fica no próprio StarField, então se mantém fixa durante o scroll em todo o site.
- Cards com `spotlight` (`<Card spotlight>`, hoje em Sobre e Stacks): brilho radial de 480px no accent a 12% que segue o mouse, como os cards "receipts" de devhasibulislam. Quando o mouse sai, volta para 92%/8%. `--spot-x/--spot-y` são `@property` em `main.scss`.
- Cards de Stacks e Projetos usam `<Chip variant="outline">`, nas proporções da seção #skills de portfolio-sweandrew. No hover, o título dos cards de Stacks vai de 50% para branco.
- Projetos: cada item tem um único `url` e um botão "Visite" (`ui.visit`).
- Contatos: cada item tem uma chave `icon` (`email | linkedin | github | whatsapp`), renderizada por `ContactIcon.vue`.
- Experiências: timeline guiada pelo scroll, como a seção #experience de portfolio-sweandrew. O preenchimento vai até a "cabeça" no meio da viewport. Ficam ativos os itens até 35% da tela acima dela, e o mais recente ganha um anel pulsante. Itens desativados ficam com `--timeline-inactive` (0.5).
- Por causa dessa camada, **nem o `body` nem as seções podem ter background**; o fundo fica no `html`. Cards usam `--color-bg` e cobrem as estrelas.

### Tipografia

- Família: **Ubuntu Sans** (Google Fonts, pesos 400, 600, 800). Substitui a Ubuntu Mono local (`src/assets/fonts/`).
- Escala (todas pares):

| Token | Tamanho / peso | Uso |
|---|---|---|
| `--fs-display` | 72 / 800 | nome no hero (mobile: 48) |
| `--fs-stat` | 48 / 600 | números das stats (mobile: 32) |
| `--fs-lg` | 24 / 400–600 | cargo, parágrafos de destaque, títulos de card, contatos |
| `--fs-nav` | 22 / 600 | nav e botões (mobile: 16–18) |
| `--fs-md` | 16 / 400–600 | corpo, descrição dos cards |
| `--fs-sm` | 14 / 600 | labels de seção, chips, datas |
| `--fs-xs` | 12 / 600 | micro-labels ("BASE", "Stacks") |

- `line-height`: 1.2 para títulos, 1.5 para parágrafos.

### Raios

- `--radius-pill: 999px` (header, nav, botões, chips)
- `--radius-card: 24px` (Penpot usa 25 → arredondado para 24)

### Espaçamento

Escala única, **somente múltiplos de 2** (base 8 com passos finos):

```
--space-1: 2px   --space-2: 4px   --space-3: 8px   --space-4: 12px
--space-5: 16px  --space-6: 24px  --space-7: 32px  --space-8: 48px
--space-9: 64px  --space-10: 96px --space-11: 128px
--space-section-mobile: 400px
```

Valores ímpares do Penpot (59, 81, 107, 223…) são sempre arredondados para o token mais próximo. **Nenhum valor ímpar** de margin, padding, gap, width, height, top/left ou border-radius pode aparecer no SCSS (bordas de 1px são a única exceção).

### Breakpoints

- `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px` (mobile-first).

---

## 5. Regras de layout (obrigatórias)

### Seções

- **Desktop (≥ `lg` / 1024px):** cada `<section>` ocupa **100% da altura da viewport**:
  - `min-height: 100vh; min-height: 100dvh;` (usar `min-height`, nunca `height`, para não cortar conteúdo).
  - Conteúdo centralizado verticalmente com flex (`display: flex; flex-direction: column; justify-content: center`).
  - Header fixo: compensar com `scroll-margin-top` nas seções e padding-top no hero.
- **Mobile (< 1024px):** fluxo **contínuo**, sem altura mínima; **400px de espaçamento entre seções** (`margin-block-start: var(--space-section-mobile)` a partir da segunda seção).

### Container e alinhamento

- Um único container para todas as seções: `max-width: 1400px; margin-inline: auto;` com padding lateral de 16px (mobile), 32px (tablet), 64px (desktop).
- Todos os labels de seção, títulos e blocos começam na **mesma borda esquerda** do container. No Penpot os labels variam entre x=246/247/266: isso é um erro do rascunho, não uma intenção.
- O header usa a mesma largura do container.
- Use flex/grid com `gap` para distribuir elementos; não posicione elementos com offsets manuais.

### Grids

- **Sobre:** 2 colunas no desktop (texto à esquerda, stats 2×2 à direita); 1 coluna no mobile.
- **Stacks:** cards em 2 colunas no desktop, 1 coluna no mobile.
- **Projetos:** 4 colunas em ≥ `xl`, 2 em `md`–`lg`, 1 no mobile. Cards com mesma altura; botão alinhado à base do card.
- **Contatos:** lista vertical com label pequeno e valor alinhados em grid de 2 colunas (label com largura fixa).

---

## 6. Seções: Penpot → componente → dados

| Seção (âncora) | Componente | Conteúdo no Penpot | Dados |
|---|---|---|---|
| Header | `AppHeader.vue` | pill com borda `--color-primary-dark` 2px; nome à esquerda; nav central (Início, Projetos, Sobre, Experiências) em pill `--color-nav-pill`; botão redondo = **toggle PT/EN**; CTA "Contatos" em pill `--color-primary-dark`. Mobile: menu colapsável. | `site.json > nav` |
| Início (`#inicio`) | `HeroSection.vue` | nome 72/800 centralizado em 2 linhas, cargo 24, tagline 24 centralizada, linha meta com "BASE / 10 anos" e "Stacks" (PHP, Vue, HTML, CSS, Node) | `site.json > hero` |
| Sobre (`#sobre`) | `SobreSection.vue` | label, parágrafo principal + parágrafo secundário (muted), 4 stats (10 anos de experiência, 4 linguagens, 50+ projetos, 99.9% uptime) | `site.json > sobre` |
| Stacks (`#stacks`) | `StacksSection.vue` | cards com bolinha accent (14–16px) + título da categoria + chips | `stacks.json` |
| Experiências (`#experiencias`) | `ExperienciasSection.vue` | timeline vertical com linha accent 1px e marcadores; data (14/600 accent), "Cargo • Empresa" (24/600, separador em bolinha branca 25%), descrição muted | `experiencias.json` |
| Projetos (`#projetos`) | `ProjetosSection.vue` | label, parágrafo intro, cards (título 24/600, descrição 16, botão pill "Visite"). Memocalc entra aqui com imagens e link de download. | `projetos.json` |
| Contatos (`#contatos`) | `ContatosSection.vue` | lista de label pequeno + valor 24 | `site.json > contatos` |

Os links atuais de contato estão em `src/components/Contatos.vue` (LinkedIn, GitHub, WhatsApp) e devem ser migrados para o JSON.

---

## 7. Roteiro da refatoração

Execute em ordem; cada fase deve terminar com `npm run build` sem erros.

1. **Migrar Vue CLI → Vite.** Remover `@vue/cli-*`, `babel.config.js`, `vue.config.js`, `core-js`; mover `public/index.html` para a raiz no formato Vite; ajustar `jsconfig.json` e `.eslintrc.js`. Validar com `npm run build && npm run preview`.
2. **Fundação de estilos.** `_tokens.scss`, `_reset.scss`, `_mixins.scss`, Ubuntu Sans, container e regras de seção (100vh no desktop / 400px no mobile).
3. **Dados.** Criar os JSON em `public/data/` migrando o conteúdo atual de `src/views/Home/First.vue`, `src/views/Home/Projetos.vue`, `src/components/Contatos.vue`, `src/views/Memocalc.vue` e `src/components/Downloads.vue`. Onde o Penpot tem placeholder ("I build software that ships…", "email.example.gmail.com", "Nome Projeto"), use o conteúdo real existente ou marque com `TODO` e avise o usuário.
4. **Composables.** `useSiteData` e `useLang`; `App.vue` renderiza as seções a partir dos dados, com estado de loading/erro.
5. **Seções.** Implementar na ordem do design (Header → Hero → Sobre → Stacks → Experiências → Projetos → Contatos), comparando cada uma com `export_shape` do Penpot e com os sites de referência.
6. **Remover legado:** `src/views/`, componentes antigos (`Header`, `Footer`, `Contatos`, `Downloads`, `Supportme`, `HelloWorld`), SVGs e fontes não utilizados.
7. **Revisão final:** alinhamento à borda do container, auditoria de espaçamentos (nenhum valor ímpar), responsivo em 360 / 768 / 1024 / 1440 / 1920, troca de idioma, links e deploy.

---

## 8. Convenções

- Componentes em PascalCase, `<script setup>`, `<style lang="scss" scoped>`.
- Sem cores, fontes ou espaçamentos literais nos componentes: sempre tokens.
- Âncoras: `#inicio`, `#sobre`, `#stacks`, `#experiencias`, `#projetos`, `#contatos`; `scroll-behavior: smooth` (respeitando `prefers-reduced-motion`).
- Acessibilidade: landmarks (`header`, `main`, `section` com `aria-labelledby`), `lang` do `<html>` sincronizado com o idioma, foco visível, contraste ≥ 4.5:1 e links externos com `rel="noopener"`.
- Imagens com `alt` vindo do JSON, `loading="lazy"` fora do hero.
- Commits pequenos, um por fase do roteiro.
