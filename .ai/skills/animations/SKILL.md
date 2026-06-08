---
name: animations
description: Portfolio skill-section animation guide. Use when modifying the portfolio Skills section, skill-group cards, transparent technology logos, chip hover states, staggered reveal timing, or any animation around skill categories and logo badges.
---

# Animations

Use this skill when editing the portfolio Skills section. Preserve the current technical-editorial direction: off-white surface, burnt-orange accent, clean transparent technology logos, and restrained motion that feels engineered rather than flashy.

## Source Files

- Data: `src/data/skills.ts`
- Section layout: `src/components/sections/SkillsSection.tsx`
- Section CSS: `src/components/sections/SkillsSection.module.css`
- Group card: `src/components/features/SkillGroup.tsx`
- Group CSS: `src/components/features/SkillGroup.module.css`
- Logo renderer: `src/components/ui/SkillIcon.tsx`
- Logo CSS: `src/components/ui/SkillIcon.module.css`

## Skill Types

Keep all skill categories represented:

- Programming languages: Python, SQL, JavaScript
- Framework & Runtime: FastAPI, Uvicorn
- Infrastructure & Data: PostgreSQL, Redis, Docker, Linux
- AI / Computer Vision: OpenCV, NumPy, Pandas, YOLO
- Tools: Git, Postman

## Logo Rules

- Prefer transparent SVG logos. Do not use sources that include a visible square/card background.
- Use Devicon SVG for common technologies: Python, PostgreSQL, FastAPI, Redis, Docker, Linux, OpenCV, NumPy, Pandas, Git, Postman.
- Use local transparent assets when the official/common CDN logo has a built-in background. Current local assets:
  - `/images/skills/javascript.svg`
  - `/images/skills/uvicorn.png`
- Use SimpleIcons only when no clean transparent Devicon/local asset is available. Current exception: YOLO.
- Keep `SkillIcon` as a renderer only. Do not hardcode skill lists inside UI components.
- Keep fallback initials for broken icons, but treat fallback as an error state, not the normal design.

## Animation Model

Use three layers of motion:

1. Section/card entrance
2. Group-card reveal
3. Skill-chip and logo micro-interactions

### Section/Card Entrance

- Animate each `SkillGroup` with `skill-rise`.
- Use `opacity: 0` and `translateY(24px)` as the hidden state.
- End at `opacity: 1` and `translateY(0)`.
- Use `var(--duration-slow)` and `var(--ease-out)`.
- Stagger groups by setting `--delay` from React: `index * 100ms`.

```tsx
style={{ "--delay": `${index * 100}ms` } as CSSProperties}
```

### Group-Card Reveal

On `.group:hover` and `.group:focus-within`:

- Lift the card by `translateY(-6px)`.
- Increase contrast with a slightly stronger border, white surface, and soft orange shadow.
- Move `.headline` from centered to top-left using `top`, `left`, and `transform`.
- Reveal `.skills` by transitioning `opacity` and `translateY`.
- Keep the reveal accessible by matching hover behavior with `:focus-within`.

Required timing:

- Card/background/headline transitions: `var(--duration-normal)`.
- Headline movement: `var(--ease-spring)`.
- Skill list reveal: `var(--ease-out)`.

### Skill-Chip Animation

Default chip state:

- Hidden inside the card until group hover/focus.
- Start at `translateY(var(--space-2))`.
- Use white translucent background, pill radius, compact mono label, and soft shadow.

On group hover/focus:

- Bring every `.skill` to `translateY(0)`.
- Stagger chips with at least 80ms between items:
  - second item: `80ms`
  - third item: `160ms`
  - fourth item: `240ms`

On direct chip hover:

- Lift the chip by `translateY(-3px)`.
- Change border to orange tint.
- Keep the chip background subtle; do not add heavy colored fills.
- Trigger the nested logo animation using `[data-skill-icon]`.

### Logo Animation

The logo should look like a transparent brand mark, not a logo inside another card.

Default state:

- Wrapper `.mark`: no background, no border, `30px` square alignment box.
- Image `.icon`: `28px`, `object-fit: contain`, slight saturation/contrast/drop-shadow.

On logo or chip hover:

- Apply a colored drop shadow using `--skill-glow`.
- Move the mark by `translateY(-2px)` and scale to `1.08`.
- Scale the image to `1.1`.
- Increase brightness/saturation slightly.
- Keep duration at least `var(--duration-fast)`.

## Implementation Checklist

- Keep data in `src/data/skills.ts`; do not duplicate categories in components.
- Keep source icons transparent and clean before solving visual issues with CSS.
- Use `minmax(0, 1fr)` for the skills board grid.
- Keep flex children `min-width: 0` where text can shrink.
- Mirror hover interactions with keyboard focus where possible.
- Do not use CSS grid backgrounds, decorative orbs, or heavy gradient panels.
- Do not animate `font-size`; use transform and opacity.
- Do not use animation durations below `0.25s`.
- After changes, run `npm run build`.
