---
name: tokens
description: >-
    Name and layer admin-ui CSS variables (--aui-*). Use when adding or
    changing a token, or when a CSS Module reads var(--aui-*) — including
    «токен», «переменная», «--aui».
---

# admin-ui tokens

Tokens are CSS custom properties only. There is no JS token API and no Tailwind theme. They live in `src/ds/tokens/` today (alias `@ds/tokens`, public export `./tokens` in `package.json`). A later `@ensi-platform/admin-ui-tokens` package keeps the same files. The files outrank the lists: `primitives.css`, `semantic.css` (`:root` is light), `semantic.dark.css` (`[data-theme="dark"]`), `index.css` imports them.

Open [`references/inventory.md`](references/inventory.md) when the change adds or renames a `--aui-*` name. The inventory is the v1 list; a name already in `semantic.css` wins over the list.

1. Read the place block in `src/ds/tokens/semantic.css` for the primitive being styled.
   **Done when:** that block has been read, or the change does not touch a token or a `var(--aui-*)`.
2. Apply the naming, layer, and delivery rules below.
   **Done when:** every new `--aui-*` matches the formulas, and a CSS Module reads only its own place.

## Naming

Primitive scale, read only from `semantic.css`:

```
--aui-{scale}-{n}
```

- For spacing and radius, `n` is px: `--aui-radius-8` is `8px`. The scale is a base (`--aui-spacing`, `--aui-radius`) plus `calc(var(--aui-…) * N)`.
- Write the step with a hyphen (`--aui-radius-8`). A slash (`--aui-radius/8`) is not a valid custom property name.
- Color primitives look like `--aui-grey-50`, `--aui-red-600`, `--aui-white`.

Semantic, for components:

```
--aui-{place}-{role}-{variant}[-{modifier}]
```

| Slot | Examples |
| --- | --- |
| place | `page`, `surface`, `control`, or the primitive name (`button`, …) |
| role | `bg`, `fg`, `border`, `radius`, `h`, `pad-y`, `pad-x`, `gap`, `line-height`, `duration`, `ease` |
| variant | `primary`, `secondary`, `tertiary`, `muted`, `elevated`, `brand`, `danger`, `success`, `warning`, `link`, `focus`, `sm` / `md` / `lg` |
| modifier | `hover`, `active` |

Leave the `color-` prefix off. The default variant is `primary` (`default` and `base` are not variant names). Examples: `--aui-page-bg-primary`, `--aui-button-bg-primary`, `--aui-page-radius-md`.

## Who reads which layer

| Layer | Example | Who reads it |
| --- | --- | --- |
| primitive | `--aui-grey-500`, `--aui-radius-8` | `semantic.css` only |
| semantic | `--aui-control-bg-brand` | other semantic tokens and place tokens |
| place UI | `--aui-button-bg-primary` | that primitive's CSS Module |

A `styles.module.css` reads `--aui-{place}-*` for its own place. It reaches primitive color and radius through the semantic token, not directly.

## Delivery

The app and Storybook import tokens once, as a side effect. Inside admin-ui, modules use `var(--aui-…)`.

- Public entry: `src/ds/tokens/index.ts`, exported as `@ensi-platform/admin-ui/tokens`.
- A component module does not import that entry. Storybook already imports `src/ds/tokens/index.css` from `.storybook/preview.tsx`.
- Later, the app entry imports `@ensi-platform/admin-ui-tokens` and this package depends on it as a peer.

## Theme

`html[data-theme="light"|"dark"]`. Light values sit on `:root` in `semantic.css`. Dark remaps semantic tokens in `semantic.dark.css` under `[data-theme="dark"]`.

- The remap covers semantic tokens only (`page`, `surface`, `control`, place UI). Leave primitives unduplicated.
- A component reads `var(--aui-{place}-*)` and has no theme branch. The app and Storybook set `data-theme` on `document.documentElement`.
- Multi-brand is later. A brand override replaces semantic tokens in the template.
- Leave `.primaryDark` and a JS theme object out of CSS Modules.

## Motion

Primitive: `duration-fast`, `duration-normal`, `ease-out`. Semantic control: `control-duration-fast`, `control-duration-normal`, `control-ease-out`. A CSS Module reads the place alias only:

```
{place}-duration-fast | {place}-ease-out
```

Places that have motion are listed in `references/inventory.md`. Always pair them with `prefers-reduced-motion: reduce` → `transition: none`. A duration literal (`120ms`) or a raw `ease` in a CSS Module stands in for a missing place token; add the place token and use it.

## Example

```css
/* semantic.css — the button place aliases control */
--aui-button-bg-primary: var(--aui-control-bg-brand);

/* button/styles.module.css — only --aui-button-* */
.root {
    min-height: var(--aui-button-h-md);
    transition:
        background-color var(--aui-button-duration-fast) var(--aui-button-ease-out),
        border-color var(--aui-button-duration-fast) var(--aui-button-ease-out),
        color var(--aui-button-duration-fast) var(--aui-button-ease-out);
}

@media (prefers-reduced-motion: reduce) {
    .root {
        transition: none;
    }
}

.primary {
    background: var(--aui-button-bg-primary);
    color: var(--aui-button-fg-primary);
}
```
