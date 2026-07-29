Text role classes. Family: **Inter** via `--aui-font-sans` (loaded with tokens).

```tsx
import { typographyStyles } from '@ensi-platform/admin-ui';
```

## When to use

- body copy in primitives and admin screens
- compose `typographyStyles.*` in JSX; do not duplicate `font-*` / `line-height` in your CSS Modules
- base font on the root is already set by `AdminUiProvider` via `--aui-font-sans`

## API (short)

| Class | Size | Weight | Line-height |
| --- | --- | --- | --- |
| `bodyXs` | `--aui-font-size-xs` | regular | tight |
| `bodyS` | `--aui-font-size-sm` | regular | normal |
| `bodyM` | `--aui-font-size-md` | regular | normal |
| `bodyL` | `--aui-font-size-lg` | regular | normal |

Tokens: `--aui-font-sans`, `--aui-font-size-*`, `--aui-font-weight-regular|medium|semibold`, `--aui-line-height-tight|normal`.

`label*` / `heading*` — later.

## Example

```tsx
<p className={typographyStyles.bodyM}>Interface text</p>
```
