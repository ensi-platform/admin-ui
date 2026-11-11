# Stories

Open this file from `write-component-docs` when writing `index.stories.tsx` or `docs/index.tsx`. Description and Example format is [`description.md`](description.md).

Samples: `src/button/docs` (simple), `src/input/docs` and `src/select/docs` (field plus form). One `index.stories.tsx` per primitive. A `Form*` story lives in that file. A separate `form-*.stories.tsx` splits the primitive; keep the form story in `index.stories.tsx`.

## StoryComponent (`docs/index.tsx`)

A thin wrapper so the Docs prop table can read the props:

```tsx
/** Story wrapper for react-docgen-typescript. */
export const ButtonStoryComponent = (props: TButtonProps) => <Button {...props} />;
ButtonStoryComponent.displayName = 'Button';
```

A complex demo (tabs, a modal) can live in the story with its own `displayName` and no `index.tsx`.

## Meta

- CSF3: `Meta`, `StoryObj`, `satisfies Meta<typeof …>`.
- `docsDescriptionByLocale: { ru, en }` — Description, before the API table.
- `docsExampleByLocale: { ru, en }` — `Example.*.md`.
- `docsCssVariables` — the string from `./cssVariables`, when the UI has tokens. Otherwise omit it.
- `controls: { expanded: true }`.
- `DEFAULT_ARGS` and `DEFAULT_ARG_TYPES` (select or boolean for the main props).
- `component:` is the StoryComponent or the demo.

DocsPage order: Description, CSS variables, Example, Primary, Controls, Stories.

## Sidebar title

| Kind | title |
| --- | --- |
| Root docs-only | `'Main'`, `'Getting started'`, `'AI'` |
| Base | `'Base/Button'`, `'Base/Badge'`, `'Base/Tag'`, `'Base/Tabs'`, `'Base/Table'`, `'Base/Loader'`, `'Base/Hooks'` |
| Overlays | `'Overlays/BottomSheet'`, `'Overlays/Drawer'`, `'Overlays/Modal'`, `'Overlays/Popover'`, `'Overlays/Tooltip'`, `'Overlays/ActionPopup'`, `'Overlays/ModalHub'`, `'Overlays/Toast'` |
| Form, Field, control | `'Form/Input'`, `'Form/Field'`, `'Form/Form'`, `'Form/Checkbox'`, `'Form/CheckboxGroup'`, `'Form/Switch'` |
| Select and neighbours | `'Form/Combobox'` (docs-only, do not import it), `'Form/Combobox/Select'`, … |
| Date and time | `'Form/DateField/DatePicker'`, … |
| Design system | `'Design System/Typography'`, `'Design System/Provider'`, `'Design System/Icons'` |

## Which stories

Show what is useful to see. The full API stays in Description and `types.ts`.

- `Default` — the usual look, plus controls.
- `Sizes` / `Variants` — rows via `render`.
- `Disabled` / `Invalid` / `Clear` — via `args` (shared layout: `render: Default.render`).
- The form version: `WithForm` (`Form` + the Form component + submit). Add `WithField` when the field shell is the point.
- `Controlled` — only when controlling the value from outside is not obvious.

Export names are English (`Default`, `WithIcon`). Button labels, field labels, placeholders, and errors in the examples are English.

## Imports

- StoryComponent: `from '.'`.
- This primitive's `Form*` and types: relative `../`.
- Another primitive: `@/button`, `@/form`, and the same `@/` form.
- Docs: `./Description.*.md`, `./Example.*.md`, `./cssVariables`.
