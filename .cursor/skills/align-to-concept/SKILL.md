---
name: align-to-concept
description: >-
    Align admin-ui visuals and screen layouts to the Ensi AP design language
    (layer budget, list/filters/detail). Use when working on density, surfaces,
    borders, list or detail layout, or when the user asks to match
    design-language. Sidebar/nav chrome comes from Storybook App/CascadeMenu.
---

# Align to concept

Authoring-package skill (not consumer `docs/skills/`). Token naming stays in `tokens.mdc`.

## Before changing visuals

1. Read [`docs/design-language.md`](../../../docs/design-language.md).
2. Nav is WIP; source = Storybook `App/CascadeMenu` + design-language «App chrome».
3. Compare neighbour primitives (`Button`, `Tag`, `Badge`, `Table`, `Tabs`, `Field` + controls).

## Checklist

Copy and tick:

```
- [ ] Zone containers: bg XOR border (except control / focus / alert)
- [ ] Nested surface boxes from page ≤ 2
- [ ] Tag/Badge/chip: one signal (tint XOR outline)
- [ ] Nav: use `CascadeMenu` (hover flyout); logo LogoEnsiMark + ensi-opensource text currentColor; `data-open` only while flyout open; no current-page highlight (breadcrumbs); single Pinned L0 item → flyout list (leaf+folder, max 8, pinUserId LS); search button next to collapse; dimmed backdrop + small window above center (field, linked leaves + ancestor path); Escape or backdrop click closes; collapsed rail stays collapsed; no counters
- [ ] List: ActiveFilters (Tag + clear link) without bordered bar; table flush; pagination without per-page boxes
- [ ] Filters: fields on page; no muted bar wrapping controls
- [ ] Detail: underline Tabs; no per-section cards; at most one heavy alert
```

## Do not

- invent a parallel sidebar chrome — use `CascadeMenu` / `MenuList`
- restyle dark as a different product look (remap only)
- duplicate long token tables — link `tokens.mdc`
