Root provider for the package:

- portal isolation
- text direction
- built-in label strings
- page substrate (`--aui-page-bg-primary` / `--aui-page-fg-primary`)

```tsx
import { AdminUiProvider, useAuiLabels } from '@ensi-platform/admin-ui/provider';
```

## When to use

- always — UI root
- paints the app canvas (background and text color); content inset stays on the host (`main`)

## API (short)

| Prop        | Values                | Default       | Description      |
| ----------- | --------------------- | ------------- | ---------------- |
| `locale`    | `string`              | `ru-RU`       | BCP 47           |
| `direction` | `ltr` \| `rtl`        | from `locale` | text direction   |
| `labels`    | `Partial<IAuiLabels>` | EN defaults   | built-in strings |
| `className` | `string`              | —             | root `div`       |

Hooks: `useAuiLabels()`, `useAuiLocale()`, `useAuiDirection()`.
