---
name: align-to-concept
description: >-
    Align admin-ui visuals and screen layouts to the Ensi AP design language
    (layer budget, list/filters/detail). Use when working on density, surfaces,
    borders, list or detail layout, or when the user asks to match
    design-language — including «плотность», «как в концепте», «слои».
---

# Align to concept

Authoring-package skill (not the consumer skill `ai/skills/admin-ui`). Token names stay in the `tokens` skill. Primitive CSS classes stay in the `component-styles` skill. This skill is the layer budget and the chrome.

## Before changing visuals

1. Read [`docs/design-language.md`](../../../docs/design-language.md).
   **Done when:** that file has been read, and the reply names `docs/design-language.md`.
2. Nav is WIP. The source is Storybook `App/CascadeMenu` plus the design-language section «App chrome».
   **Done when:** a nav change cites `App/CascadeMenu` or «App chrome», or the change is not nav.
3. Compare neighbour primitives (`Button`, `Tag`, `Badge`, `Table`, `Tabs`, `Field` + controls).
   **Done when:** the reply names the neighbour you compared for this surface.

## Checklist

Copy and tick. **Done when:** the reply contains this list, each line checked or left open with the file that still breaks it.

```
- [ ] Zone containers: bg XOR border (except control / focus / alert)
- [ ] Nested surface boxes from page ≤ 2
- [ ] Tag/Badge/chip: one signal (tint XOR outline)
- [ ] Nav: `CascadeMenu` (hover flyout, aim-delay, no Back); L0 light = `neutral-50` `#fafafa` (page is white), dark = `black-900` + `grey-700`, flyout bg matches L0; logo `LogoEnsiMark` + `ensi-opensource` in `currentColor`, optional `title`, collapse at the top; `data-open` only while the flyout is open; no current-page highlight (breadcrumbs); a single Pinned item sits at the top of L0 and opens a flyout list (leaf+folder, max 8, `pinUserId` in local storage); search button next to collapse; dimmed backdrop + small window above center (field, linked leaves + ancestor path); Escape or backdrop click closes; collapsed rail stays collapsed; no counters
- [ ] List: ActiveFilters (Tag + clear link) without a bordered bar; table flush; pagination without a border box per page
- [ ] Filters: fields on the page; no muted bar wrapping the controls
- [ ] Detail: underline Tabs; sections inside a tab use VerticalTabs; no card per section; at most one heavy alert
```

## Keep to the samples

- Sidebar chrome is `CascadeMenu` / `MenuList`.
- Dark theme remaps the semantic tokens. It does not invent a second product look.
- Long token tables live in the `tokens` skill. Link that skill instead of pasting them.
