---
name: component-api
description: >-
    Shape the public props of an admin-ui primitive (as, size, variant, icon,
    dataTestId, ref). Use when adding or changing a primitive's types or
    Component props — including «проп», «api», «size», «variant».
---

# Primitive public API

Sample that outranks this text: `src/button/types.ts` for a polymorphic DOM control, `src/checkbox/types.ts` for a React Aria control. Open [`references/props-split.md`](references/props-split.md) when the change adds a props interface or a `Form*` wrapper.

1. Read the primitive's `types.ts` and the sample that matches it.
   **Done when:** `types.ts` and that sample have been read.
2. Apply the contract below to the diff.
   **Done when:** each bullet that applies to this primitive holds in the diff.

## Contract

- Polymorphism, when the root element changes: `as?: ElementType` plus `TMergeElementProps` from `@ds/common`.
- `size` / `variant` follow the table below. A primitive with no chrome row omits them.
- An icon is one object. On Button that type is `IButtonIconProps` (`Component`, `after?`, `indent?`, `size?`, `className?`, `fill?`) in `src/button/types.ts`.
- `dataTestId` comes only from `IDataTestIdProps` in `@ds/common` and is rendered as `data-test-id`.
- Take `className` from the base, and leave it out of `I*OwnProps`, Base, and Theme. DOM and polymorphic roots get it from `ComponentPropsWithRef` or `TMergeElementProps`. A RAC root gets it from the RAC props, so leave `'className'` out of `T*RacOmit`. `Icon` and `IButtonIconProps` declare `className` themselves because the icon root has no DOM or RAC base.
- A props `type` alias is `TButtonProps`. An interface is `I*` (`IButtonBaseProps`, `IButtonIconProps`).
- The component is an arrow function. `ref` is a normal prop (`ref?: Ref<HTMLElement>`), React 19. The only `forwardRef` in the package is `src/ds/common/support-ref/index.ts`, which is the React 18 boundary. Pass `type` through only when the rendered root is `button` (`src/button/Component.tsx`).
- Join classes with `cn(buttonVariants({ size, variant, block }), className)`.
- Set `displayName` for DevTools or a compound (`Object.assign`). A `ref` prop does not need `displayName`.
- Comments and JSDoc follow the `code-comments` skill.
- For now, a primitive gets no `styles` override prop, no typography tokens, and no `nowrap` / `hidden` prop. Button's `hidden` stays as `src/button/types.ts` declares it.

### block

`block?: boolean` is not a theme key and not its own `IBlockProps`. The `.block` class comes from cva and sets `width: 100%`.

- `Field` and text-like controls (`Input`, …): put `block` on `IFieldStateProps` next to `invalid` and `disabled`, default `true`. `Form*` receives it through `IFormFieldShellProps`.
- `Button`: put `block` on `IButtonOwnProps`, default `false`.
- `Badge` and `Tag` have no `block`. Toggles inherit the field from shared state; their chrome does not read it.

## size / variant

### Chrome (size and variant)

Painted UI: `Button`, `Input`, `TextArea`, `NumberInput`, `Select`, `MultiSelect`, `Checkbox`, `Switch`, `Tag`.

```ts
export type TButtonSize = 'sm' | 'md' | 'lg';
export type TButtonVariant = 'primary' | 'secondary' | 'danger';
```

- `size?: T*Size`, default `'md'`.
- `variant?: T*Variant`, default `'primary'`.
- Keys match cva and the CSS classes (`.sm`, `.md`, `.lg`, `.primary`).
- Prefix the type with the component (`TButtonSize`, not a bare `TSize`).

Checkbox's variant is `'primary'` only (`src/checkbox/types.ts`). Button's variant is the union above.

### Layout (size only)

- `Field` uses `IFieldThemeProps` (`size`) and has no `variant`. `block` stays on `IFieldStateProps`.
- Field parts (`Label`, `Hint`, `Error`) inherit `Field.size` and add no size or variant of their own.
- Assemble Field as `IFieldThemeProps` + `IFieldStateProps` + `IFieldOwnProps`.

### Status (size and a semantic variant)

- `Badge` uses `size` plus a semantic `variant`: `neutral` | `success` | `warning` | `danger` | `info`. That set has no `primary`.

### No chrome size × variant

| Component | Why |
| --- | --- |
| `Form` | RHF wrapper, no chrome |
| `Provider` | Context and the dir root |
| `Icon` | `size` is a CSS length (`number \| string`), not `TSize` |
| `icons/*` | SVG assets |
| `hooks` | Utilities |
| `CheckboxGroup` | Container. An optional `size` / `data-size` is passed through for rhythm. It is not a visual variant |
| `Form*` (`FormInput`, …) | Glue: shell and layout, plus `Pick` of theme and Content. They add no variant of their own |

## Ref

```tsx
export interface IInputOwnProps extends IDataTestIdProps {
    ref?: Ref<HTMLInputElement>;
}

export const Input = ({ ref, size = 'md', variant = 'primary', … }: IInputProps) => (
    <RacInput ref={ref} … />
);
```

Leave `forwardRef` imported from `react` only inside `src/ds/common/support-ref/index.ts`.
