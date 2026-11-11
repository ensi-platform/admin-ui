---
name: component-styles
description: >-
    Style a primitive with CSS Modules, cva, and classnames. Use when editing
    styles.module.css or theme.ts — including «стили», «cva», «класс».
---

# Primitive styles

Token names and which layer a module may read are the `tokens` skill. The sample for the cva call is `src/button/theme.ts`. The sample for the class names is `src/button/styles.module.css`.

1. Read the part's `styles.module.css` and `theme.ts` (create them beside the part when they are missing).
   **Done when:** both files exist for a part that has visual variants, or the reply says the part has no variants and has no `theme.ts`.
2. Apply the class and token rules below.
   **Done when:** the diff's classes and `var(--aui-*)` calls match those rules.

## Classes

- One CSS Module per part, named `styles.module.css`. A flat primitive keeps it in `src/<name>/`. A `components/` part keeps it in `components/<Part>/`.
- The root class is `.root`.
- Size and variant are flat classes: `.sm`, `.md`, `.lg`, `.primary`.
- A child element is `.icon`, not `root__icon`.
- States are pseudo-classes on `.root` (`:disabled`, `:focus-visible`, `:hover`), not a `.disabled` class.
- Declare variants in `theme.ts` with `class-variance-authority`, next to that CSS Module. Join them with `classnames` (`cn`).
- A module reads only its own place tokens, `--aui-{place}-*`. Motion uses that place's `*-duration-*` and `*-ease-*` tokens. Under `prefers-reduced-motion: reduce`, set `transition: none`.
- Name classes without BEM (`__`, `--`, `_`). Leave Tailwind out. Join variant classes with `cn` and cva, not `[].filter(Boolean).join(' ')`.

```css
.root {
}
.root:disabled {
}
.sm {
}
.md {
}
.primary {
}
.icon {
}
```

## theme.ts

Include every key of `T*Size` and `T*Variant`. `src/button/theme.ts` is the chrome sample (`primary`, `secondary`, `danger`, plus optional `block`).

- `.root` and the size classes carry layout, geometry, transition, disabled opacity, and the outline reset.
- A variant class carries the palette (fg, bg, border, and their hover, focus, and selected). A variant class with an empty body is not a palette; put the colors there.
- State (`invalid`, `disabled`) layers on the variant: `.primary[data-invalid]`.

In `Component.tsx`: `cn(buttonVariants({ size, variant, block }), className)` and `cn(styles.icon, icon.className)`.
