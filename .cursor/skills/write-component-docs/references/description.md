# Description and Example

Open this file from `write-component-docs` when writing `Description.*.md`, `Example.*.md`, or `cssVariables.ts`. The sample is `src/button/docs/`. Story file shape is [`stories.md`](stories.md).

A public primitive has `Description.ru.md`, `Description.en.md`, `Example.ru.md`, `Example.en.md`, and `index.stories.tsx`.

## Languages

The two Description files, and the two Example files, use the same sections and the same facts. The translation and the UI strings in examples differ (`Сохранить` / `Save`). Prop names, component names, and `import` paths stay as in the code. Storybook Docs picks the text from the Locale toolbar through `docsDescriptionByLocale` and `docsExampleByLocale` (`.storybook/DocsPage.tsx`).

### Russian prose

`Description.ru.md` and `Example.ru.md` are normal Russian. Story UI copy is English ([`stories.md`](stories.md)). The English file does not follow the list below.

An anglicism is only a code, API, or package name, and it sits in backticks:

- prop names and values: `size`, `variant`, `onOpenChange`, `sm`
- components, hooks, slots: `Modal`, `Button`, `useModal`, `Modal.Header` — write `Modal` when the sentence is about the `Modal` component
- packages and imports: `@ensi-platform/admin-ui/button`, React Aria (`ModalOverlay`)
- a DOM, HTML, or ARIA attribute or event when the sentence cites the API: `type`, `disabled`, `data-test-id`, Escape as a key

Everything else is Russian. Use the right-hand word:

| Avoid | Write |
| --- | --- |
| рендер / хендлер / лейаут / клик / фокус-стейт | отрисовка / обработчик / вёрстка / нажатие / состояние фокуса |
| controlled / uncontrolled | только управляемый / без внешнего состояния |
| viewport / fullscreen-режим | область просмотра / на весь экран |
| dismissable снаружи | закрытие снаружи (`dismissable`) |

Keep Latin and Russian in separate words. Write «диалоги подтверждения», «окно `Modal`», «через `useModal`». A hyphenated mix (`Confirm-диалоги`, `Modal-окно`, `escape-выход`) glues a code name into a Russian word; put the code name in backticks instead.

## Description format

Storybook already shows the component name, so the file has no `# Title`.

Order, and stop before a separate example section:

1. One sentence: what the component is.
2. An import block:

````md
```tsx
import { Name } from '@ensi-platform/admin-ui/<name>';
```
````

3. `## Когда использовать` / `## When to use` — two to four bullets about the product choice. A good bullet is «свободный однострочный текст» or «не для статуса — см. `Badge`». Wiring (`Field` a11y props, `FormX`, `useField`, `as`) belongs in the API section or in Example. When a neighbour is the wrong choice, say «не для … — см. Other».
4. `## API (кратко)` / `## API (short)` — a table:

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | … |

Keep the rows that carry meaning: size, variant, state, `value` / `onChange` when it is not obvious, slots, `dataTestId`, `as`. Leave the HTML and ARIA passthrough catalogue out. A field plus its `Form*` version gets `### Name` and `### FormName`.

The example lives in `Example.*.md`, so Description has no `## Пример` / `## Example` section. Leave out a «Не делать», «Частые ошибки», or «Don't» section.

## CSS variables

DocsPage renders the slot after API and before Example. Description does not repeat the variables.

- `parameters.docsCssVariables` is the raw CSS string from `docs/cssVariables.ts`.
- Every `--aui-…` line ends with an English `/* purpose */` comment.
- The source is the place block in `src/ds/tokens/semantic.css`.
- A primitive with no `--aui-*` of its own (Form, Provider, Typography) omits the parameter.

```ts
export const docsCssVariables = `/* CSS variables — Button (--aui-button-*) */
--aui-button-bg-primary: var(--aui-control-bg-brand); /* primary fill */
`;
```

## Example

`Example.ru.md` / `Example.en.md` contain only the heading and working JSX. Russian uses `## Пример` and Russian UI strings. English uses `## Example` and English UI strings.

````md
## Пример

```tsx
<Button>Сохранить</Button>
```
````

## Wiring in stories

```ts
parameters: {
  docsDescriptionByLocale: { ru: DescriptionRu, en: DescriptionEn },
  docsExampleByLocale: { ru: ExampleRu, en: ExampleEn },
  docsCssVariables, // when the primitive has tokens
}
```

Pass the two languages as separate files. The full API stays in Description and `types.ts`.

## Legacy

An old single `Description.md` plus `docs.description.component` still shows up. When you edit that primitive's docs, replace it with `Description.ru.md`, `Description.en.md`, and `docsDescriptionByLocale`.

## Consumer channel

How a consuming app receives docs is `docs/ai.md` (source `src/docs/ai/Description.en.md`). The authoring skill links Description, types, and stories. It does not paste them. This repo does not store `.cursor/skills/admin-ui`; the published skill is `ai/skills/admin-ui/`.
