Text role classes. Family: **Inter** via `--aui-font-sans` (loaded with tokens). `AdminUiProvider` root locks `font-size: 16px` (rem base).

```tsx
import { typographyStyles } from '@ensi-platform/admin-ui/typography';
```

## When to use

- body copy in primitives and admin screens
- compose `typographyStyles.*` in JSX; do not duplicate `font-*` / `line-height` in your CSS Modules
- base font on the root is already set by `AdminUiProvider` via `--aui-font-sans`
- list / detail page title — `headingM` (or `headingL`)

## API (short)

| Class        | Size                  | Weight   | Line-height               |
| ------------ | --------------------- | -------- | ------------------------- |
| `bodyXs`     | `--aui-font-size-xs`  | regular  | `--aui-line-height-xs`    |
| `bodyS`      | `--aui-font-size-sm`  | regular  | `--aui-line-height-sm`    |
| `bodySTight` | `--aui-font-size-sm`  | regular  | `--aui-line-height-tight` |
| `bodyM`      | `--aui-font-size-md`  | regular  | `--aui-line-height-md`    |
| `bodyL`      | `--aui-font-size-lg`  | regular  | `--aui-line-height-lg`    |
| `headingM`   | `--aui-font-size-xl`  | semibold | `--aui-line-height-xl`    |
| `headingL`   | `--aui-font-size-2xl` | semibold | `--aui-line-height-2xl`   |

Tokens: `--aui-font-sans`, `--aui-font-size-xs…2xl`, `--aui-font-weight-regular|medium|semibold`, `--aui-line-height-xs…2xl|tight|normal`.

`label*` — later.

## Example

```tsx
<h1 className={typographyStyles.headingM}>Orders</h1>
<p className={typographyStyles.bodyM}>Interface text</p>
```
