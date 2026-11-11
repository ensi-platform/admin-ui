---
name: react-aria
description: >-
    Integrate react-aria-components inside an admin-ui primitive. Use when
    adding or changing headless behavior, RAC imports, or built-in a11y strings
    — including «react aria», «a11y-строки».
---

# React Aria inside the primitive

Headless behavior comes from [`react-aria-components`](https://react-aria.adobe.com). Styles stay ours (CSS Modules and `--aui-*`, skill `component-styles`). The public API stays ours (`size`, `variant`, `dataTestId`); React Aria stays inside `Component.tsx`.

1. Import RAC from the package: `import { Dialog, Heading } from 'react-aria-components'`. Keep React Aria out of the `index.ts` re-exports of the package and of the primitive. Reach for `@react-aria/*` only when no RAC component covers the behavior.
   **Done when:** the diff's RAC imports come from `react-aria-components`, and no `index.ts` re-exports a React Aria symbol.
2. Wrap the app once in `AdminUiProvider` (`I18nProvider` for locale, plus a root with `isolation: isolate` and `dir`). Storybook already wraps stories. Sample: `src/provider/Component.tsx`.

    ```tsx
    import { AdminUiProvider, useAuiLabels } from '@ensi-platform/admin-ui/provider';

    <AdminUiProvider locale="ru-RU">…</AdminUiProvider>;
    ```

    **Done when:** a new root uses `AdminUiProvider`, or the change is inside a primitive that already renders under it.

3. Take built-in a11y and chrome strings from the dictionary:

    ```tsx
    const { close, clear, confirm, cancel, delete: deleteLabel, notDelete } = useAuiLabels();
    ```

    Put business copy in `children` or props, already translated by the caller. Keep built-in strings Russian in `defaultLabels`; `labels` only replaces a key. A new key goes into `IAuiLabels` in `src/provider/types.ts` and `defaultLabels` in `src/provider/context.ts`.
    **Done when:** a new user-facing string in the primitive is a `useAuiLabels()` key, or it arrives through props.

4. Read locale for `Intl` and React Aria from `useAuiLocale()`. Read direction from `useAuiDirection()`; with no `direction` prop, `useLocale` supplies it. Leave app dictionaries outside this package, and leave `@base-ui/react` out of the import list.
   **Done when:** the diff has no i18next import and no `@base-ui/react` import.
