---
name: usehooks
description: >-
    Take a generic React hook from usehooks-ts instead of writing a local copy.
    Use when adding debounce, throttle, previous value, media query, or storage
    — including «дебаунс», «хук».
---

# Shared hooks from usehooks-ts

[`usehooks-ts`](https://usehooks-ts.com) is a package dependency. Headless UI, a11y, selection, and collections stay in `react-aria-components` (skill `react-aria`). `usehooks-ts` is not re-exported from a primitive's public `index.ts`.

1. Before writing a hook, check usehooks-ts for debounce, throttle, previous, media, and storage. Import the one that matches.

    ```ts
    import { useDebounceValue, useDebounceCallback } from 'usehooks-ts';

    const [inputValue, setInputValue] = useState('');
    const [debouncedQuery] = useDebounceValue(inputValue, 300);

    const onSearch = useDebounceCallback(handleSearch, 300);
    ```

    v3 has no `useDebounce(value, delay)`. Use `useDebounceValue` for a value and `useDebounceCallback` for a function.
    **Done when:** the new hook is imported from `usehooks-ts`, or step 2 names why it is local.

2. Write a local hook only when usehooks-ts has no matching API, or the hook is package domain logic (`useAutocompleteAsyncSuggest`, `useOverlayExitComplete`).
   **Done when:** the hook is the usehooks-ts import from step 1, or the reply names which of those two cases applies.
