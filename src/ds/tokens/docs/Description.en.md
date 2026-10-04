CSS variables for the admin canvas. Not a component. Import once; primitives read their own `--aui-{name}-*` and do not import this entry.

```tsx
import '@ensi-platform/admin-ui/tokens';
```

## When to use

- app entry, before any admin screen
- page and surface colour on layout you write yourself
- not for control chrome — that stays on the primitive (`Button`, `Input`, …) and its `cssVariables.ts`

## API (short)

Theme is `data-theme="light" | "dark"` on `document.documentElement`. Light values live on `:root`, dark remaps the same names. Components do not branch on the theme.

An app layout may use only these:

| Token | Role |
| --- | --- |
| `--aui-page-bg-primary` | page fill |
| `--aui-page-fg-primary` | page text |
| `--aui-page-fg-muted` | secondary text |
| `--aui-page-fg-link` | link text (underline; same as page text) |
| `--aui-surface-bg-primary` | input / elevated fill |
| `--aui-surface-bg-muted` | secondary button, tag, hover |
| `--aui-surface-bg-elevated` | raised surface |
| `--aui-surface-border-primary` | zone stroke, when the zone has no fill |

Primitive scales (`--aui-neutral-*`, `--aui-grey-*`, `--aui-red-*`, radius, spacing) are not for app CSS. Screen layers and hex roles — `docs/design-language.md`.
