# Props split

Open this file from `component-api` when the change adds a props interface or a `Form*` wrapper.

The files outrank this table. Copy the RAC shape from `src/checkbox/types.ts`. Copy the polymorphic DOM shape from `src/button/types.ts`.

| Slice | What it holds |
| --- | --- |
| `I*ThemeProps` | `size?`, `variant?`. No `block` |
| `I*ControlProps` | Our state names (`checked`, `value`, `onChange`, …) |
| `I*OwnProps` | Extends `IDataTestIdProps`. `children?`, `ref?`. No `className`, no second `dataTestId`, no `block` |
| `I*ContentProps` | The slice `Form*` renders (children plus the control-specific or RAC passthrough fields) |
| `I*BaseProps` | Theme + `IFieldStateProps` (`invalid`, `disabled`, `block`) + Control + Own |
| `T*RacOmit` | RAC keys whose names differ from ours (`isSelected` → `checked`). No `'className'` |
| `I*Props` | Base + `Omit<Rac…, keyof Base \| TRacOmit>` |
| `IForm*Props` | Composition of shell, theme pick, and Content. No `Omit<I*Props, 'value' \| …>` |

Public state is `invalid`, `disabled`, and `block` from `IFieldStateProps`. Map RAC names (`isInvalid`, `isSelected`, `isDisabled`) inside `Component.tsx` only.

## Form* composition

Shared types live in `src/form/types.ts`: `IFormFieldShellProps`, `IFormFieldMessagesProps`, `IFormFieldLayoutProps`. Shared chrome (`IDataTestIdProps`, `TMergeElementProps`) lives in `@ds/common`.

- Text-like (`FormInput`, `FormTextArea`, `FormNumberInput`, `FormSelect`, `FormMultiSelect`): `IFormFieldLayoutProps` (the shell already carries `block`) + `Pick<Theme, 'variant'>` + `I*ContentProps`.
- Toggles (`FormCheckbox`, `FormSwitch`): `IFormFieldComponent` + `IFormFieldShellProps` + `Pick<Messages, 'hint'>` + `Pick<Theme, 'variant'>` + `I*ContentProps` (no `label` on the toggle).
- `FormCheckboxGroup`: shell + messages + Content (`children`).

Compose those interfaces. A `Form*` props type that `Omit`s `value`, `isInvalid`, or `size` off `I*Props` and then redeclares the shell fields duplicates the shell. Use the composition above instead.

## Exceptions

- `Field`: Theme (`size`) + State (`invalid`, `disabled`, `block`) + Own. Own is layout, not a chrome control.
- `Button`: polymorphic `TButtonProps` plus `IButtonThemeProps`, `IButtonOwnProps`, `IButtonBaseProps`.
- `Badge`: semantic `variant`, no `primary`.
- `Tag`: Theme + Own (including `onRemove`). No `Form*`.
- `Icon`, `Provider`, `Form`: not chrome controls.
- `ColorPicker`: a headless palette with no `size`, `variant`, or `Form*`. The chrome field is `ColorField`.

## Inheritance

The root decides the base. Add our fields on top. Drop a conflicting RAC or DOM key with `Omit` on that base, not with `Omit` on the assembled `I*Props` inside `Form*`. In JSX, pull our keys out and spread `{...props}` onto the root.

- `dataTestId` is ours, via `IDataTestIdProps`.
- `className` is inherited, as `component-api` states.
- `ref` is the React 19 prop. Add it on Own only when this root needs a ref.
