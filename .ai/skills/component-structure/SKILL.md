---
name: component-structure
description: >
  Component architecture and folder structure skill. Use this for ANY frontend task across
  React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Vite, or vanilla JS projects. MUST be used
  whenever generating UI code — enforces component decomposition instead of single-file dumps,
  PascalCase naming, and a consistent src/ folder structure. Triggers on: "build a page",
  "create a UI", "make a component", "scaffold a project", "add a section", or any request
  that produces more than one visual block of UI. Never output all UI in one monolithic file.
---

# Component Structure Skill

Your job is to produce **decomposed, maintainable frontend code** — not a single monolithic file.
Every UI output must be split into logical components with a clear folder structure.

This skill is framework-aware: apply the rules to React, Next.js, Vue, Nuxt, Svelte, SvelteKit,
Vite, or vanilla HTML+JS projects. Adapt syntax per framework, keep the structure principles identical.

---

## PHASE 0 — DECOMPOSITION AUDIT (run before writing any code)

Before writing a single line, map the UI into a component tree:

```
Page / Route
├── Layout components     (shared across pages: Navbar, Footer, Sidebar)
├── Section components    (page-level blocks: HeroSection, AboutSection)
│   └── UI components     (reusable atoms: Button, Badge, Card, Avatar)
└── Feature components    (self-contained logic: ContactForm, ProjectCard)
```

Ask internally:
1. Which parts repeat across pages? → extract to `components/common/` or `components/ui/`
2. Which parts are page-specific one-offs? → `components/sections/`
3. Which parts have their own state/logic? → `components/features/`
4. What can be a dumb presentational atom? → `components/ui/`

**Rule:** If a file exceeds 150 lines, it must be split further.
**Rule:** If two sections share any sub-element, that element becomes its own component.

---

## FOLDER STRUCTURE

### React / Next.js / Vite (React)

```
src/
├── app/                        # Next.js App Router pages (or pages/ for Pages Router)
│   └── page.tsx
├── components/
│   ├── layout/                 # Wrappers used across the whole app
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageWrapper.tsx
│   ├── sections/               # Page-level visual blocks (used once per page)
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactSection.tsx
│   ├── features/               # Self-contained logic units
│   │   ├── ProjectCard.tsx
│   │   └── ContactForm.tsx
│   └── ui/                     # Dumb reusable atoms, no business logic
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── SectionHeading.tsx
│       └── TechTag.tsx
├── hooks/                      # Custom React hooks
│   └── useScrollReveal.ts
├── lib/                        # Utilities, constants, helpers
│   ├── constants.ts
│   └── utils.ts
├── styles/
│   ├── globals.css
│   └── tokens.css              # CSS custom properties / design tokens
├── types/                      # TypeScript interfaces and types
│   └── index.ts
└── data/                       # Static content / mock data (NOT hardcoded in components)
    ├── projects.ts
    └── skills.ts
```

### Vue / Nuxt

```
src/                            # or project root for Nuxt
├── pages/                      # Route-level views
│   └── index.vue
├── components/
│   ├── layout/
│   │   ├── AppNavbar.vue
│   │   └── AppFooter.vue
│   ├── sections/
│   │   ├── HeroSection.vue
│   │   └── ProjectsSection.vue
│   ├── features/
│   │   └── ProjectCard.vue
│   └── ui/
│       ├── BaseButton.vue
│       └── BaseBadge.vue
├── composables/                # Vue composables (equivalent of hooks)
│   └── useScrollReveal.ts
├── assets/
│   └── styles/
│       ├── main.css
│       └── tokens.css
├── utils/
└── data/
```

### Svelte / SvelteKit

```
src/
├── routes/                     # SvelteKit file-based routing
│   └── +page.svelte
├── lib/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.svelte
│   │   │   └── Footer.svelte
│   │   ├── sections/
│   │   │   ├── HeroSection.svelte
│   │   │   └── ProjectsSection.svelte
│   │   ├── features/
│   │   │   └── ProjectCard.svelte
│   │   └── ui/
│   │       ├── Button.svelte
│   │       └── Badge.svelte
│   ├── stores/
│   ├── utils/
│   └── data/
└── app.css
```

### Vanilla HTML + JS (no framework)

```
src/
├── index.html                  # Entry — imports only, minimal inline content
├── components/
│   ├── navbar.js               # Each component: render function + mount logic
│   ├── hero.js
│   ├── projects.js
│   └── contact.js
├── ui/
│   ├── button.js
│   └── badge.js
├── styles/
│   ├── main.css
│   ├── tokens.css
│   └── components/
│       ├── navbar.css
│       └── hero.css
├── data/
│   └── content.js
└── utils/
    └── scroll.js
```

---

## NAMING CONVENTIONS

### Files & Components
- **All components:** `PascalCase` — `HeroSection.tsx`, `ProjectCard.vue`, `BaseButton.svelte`
- **Hooks / composables:** `camelCase` with prefix — `useScrollReveal.ts`, `useActiveSection.ts`
- **Utilities:** `camelCase` — `formatDate.ts`, `cn.ts`
- **Data files:** `camelCase` — `projects.ts`, `skillGroups.ts`
- **CSS files:** `kebab-case` — `hero-section.css`, `design-tokens.css`
- **Constants:** `SCREAMING_SNAKE_CASE` inside file — `export const MAX_PROJECTS = 6`

### Component naming rules
- Section components suffix `Section` — `HeroSection`, `AboutSection`
- Layout components no suffix — `Navbar`, `Footer`, `Sidebar`
- Feature components named by what they do — `ProjectCard`, `ContactForm`, `SkillGroup`
- UI atoms prefixed or suffixed clearly — `Button`, `Badge`, `SectionHeading`, `TechTag`
- Vue ui atoms use `Base` prefix — `BaseButton`, `BaseCard` (avoid conflict with HTML elements)

---

## COMPONENT RULES

### Every component must:
1. Have **one clear responsibility** — name must describe it exactly
2. Accept data via **props / data bindings** — never hardcode content strings inside component logic
3. Have all **static content imported from `data/`** — components are templates, not content stores
4. Stay **under 150 lines** — if longer, extract sub-components
5. Export **one default export** per file — no multi-component files

### Props / interfaces (TypeScript projects):
```typescript
// Always define props interface above the component
interface ProjectCardProps {
  title: string
  description: string
  stack: string[]
  status: 'completed' | 'in-progress'
  href?: string
}
```

### Data separation:
```typescript
// data/projects.ts — content lives here
export const projects = [
  {
    id: 'vietais',
    title: 'VietAIS',
    description: '...',
    stack: ['Python', 'YOLOv8', 'FastAPI'],
    status: 'in-progress' as const,
  }
]

// components/features/ProjectCard.tsx — only rendering logic
import { projects } from '@/data/projects'
```

### Styling:
- CSS Modules: `ComponentName.module.css` co-located with component
- Tailwind: classes in component, shared tokens in `tokens.css`
- Global styles: `globals.css` only for resets and base typography
- Never use inline `style={{}}` for anything other than dynamic values (animation delays, JS-computed values)

---

## OUTPUT PROTOCOL

When generating UI for any request:

### Step 1 — Output the file tree first
Always start by printing the complete folder structure before any code:
```
📁 src/
├── 📄 components/sections/HeroSection.tsx
├── 📄 components/features/ProjectCard.tsx
└── ...
```

### Step 2 — Generate files in dependency order
Bottom-up: ui atoms → features → sections → layout → page entry
```
1. ui/Button.tsx
2. ui/TechTag.tsx
3. features/ProjectCard.tsx
4. sections/HeroSection.tsx
5. sections/ProjectsSection.tsx
6. app/page.tsx  ← imports everything, minimal own code
```

### Step 3 — Entry file is an orchestrator only
The page/route/index file must only import and compose — no business logic, no hardcoded content:

```tsx
// app/page.tsx — CORRECT
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
    </main>
  )
}
```

```tsx
// app/page.tsx — BANNED: monolithic dump
export default function Home() {
  return (
    <main>
      <section style={{...}}>  {/* 400 lines of inline everything */}
        ...
      </section>
    </main>
  )
}
```

### Step 4 — Comment the component boundary
First line of every component file:
```tsx
// HeroSection.tsx — Page-level hero block. Props: none. Data: content/hero.ts
```

---

## ANTI-PATTERNS — ALWAYS AVOID

| Anti-pattern | Fix |
|---|---|
| All UI in `App.tsx` or `index.html` | Split into Section + Feature + UI components |
| Hardcoded strings inside JSX/template | Move to `data/` file, import |
| `style={{ color: '#fff', padding: '2rem' }}` everywhere | CSS module or Tailwind class |
| Component file > 150 lines | Extract sub-components |
| Generic names: `Component1.tsx`, `Block.tsx`, `Item.tsx` | Name by responsibility |
| Multiple components in one file | One component per file |
| Importing data inside UI atoms | Pass as props instead |
| `../../../../../../components/Button` | Set up path alias `@/components/Button` |

---

## PATH ALIASES (set up on all projects)

### Vite / React
```typescript
// vite.config.ts
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}
```

### Next.js
```json
// tsconfig.json
{ "paths": { "@/*": ["./src/*"] } }
```

### Vue / Nuxt
```typescript
// nuxt.config.ts or vite.config.ts — same alias pattern
```

Always use `@/` imports, never relative `../../` chains longer than one level.

---

## INTEGRATION WITH anti-slop-ui SKILL

If `anti-slop-ui` skill is also active in this project:
- This skill owns: **file structure, component decomposition, naming, data separation**
- anti-slop-ui owns: **visual design, animation, color, typography inside each component**
- Workflow: decompose structure first (this skill) → apply design rules per component (anti-slop-ui)
