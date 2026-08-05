---
name: align-to-concept
description: >-
    Align admin-ui visuals and screen layouts to the Ensi AP design language
    (layer budget, list/filters/detail). Use when working on concepts, density,
    подложки, обводки, list or detail layout, or when the user asks to match
    design-language / *-v3.png. Sidebar/nav chrome is NOT taken from v3 screens.
---

# Align to concept

Authoring-package skill (not consumer `docs/skills/`). Token naming stays in `tokens.mdc`.

## Before changing visuals

1. Read [`docs/design-language.md`](../../../docs/design-language.md).
2. For **content** screens only, open the matching canon in [`docs/concepts/`](../../../docs/concepts/):
   - list table → `ap-concept-list-table-{light|dark}-v3.png`
   - list filters → `ap-concept-list-filters-{light|dark}-v3.png`
   - detail → `ap-concept-detail-{light|dark}-v3.png`
3. **Do not** use those PNGs for sidebar / CascadeMenu IA or chrome — nav is WIP; source = Storybook `App/CascadeMenu` + design-language «App chrome».
4. Compare neighbour primitives (`Button`, `Tag`, `Badge`, `Table`, `Tabs`, `Field` + controls).

## Checklist

Copy and tick:

```
- [ ] Zone containers: bg XOR border (except control / focus / alert)
- [ ] Nested surface boxes from page ≤ 2
- [ ] Tag/Badge/chip: one signal (tint XOR outline)
- [ ] Nav: use `CascadeMenu` (hover flyout); do NOT match sidebar from *-v3.png; logo LogoEnsiMark + ensi-opensource text currentColor; `data-open` only while flyout open; no current-page highlight (breadcrumbs); single Pinned L0 item → flyout list (leaf+folder, max 8, pinUserId LS); no search/counters
- [ ] List: Tag row without bordered bar; table flush; pagination without per-page boxes
- [ ] Filters: fields on page; no muted bar wrapping controls
- [ ] Detail: underline Tabs; no per-section cards; at most one heavy alert
```

## Do not

- invent a parallel sidebar chrome — use `CascadeMenu` / `MenuList`
- treat v3 concept sidebar as visual truth
- restyle dark as a different product look (remap only)
- duplicate long token tables — link `tokens.mdc`
