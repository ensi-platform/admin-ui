A link-styled button that shows a text and copies it.

```tsx
import { CopyButton } from '@ensi-platform/admin-ui/copy-button';
```

## When to use

- a short id the user copies: an order number, a code, an article
- the text stays visible
- hover shows “Copy”; after success the tooltip shows what was copied; a failure says the copy did not work

A plain action uses `Button` or `Link`.

## API (short)

| Prop         | Values   | Default | Description                                |
| ------------ | -------- | ------- | ------------------------------------------ |
| `children`   | `string` | —       | button text and the clipboard value        |
| `timeout`    | `number` | `1000`  | how long the success or error tooltip stays, in ms |
| `dataTestId` | `string` | —       | `data-test-id` for tests                   |

Names come from `AdminUiProvider`: `labels.copy`, `labels.copied` (`{value}` is the copied text), `labels.copyFailed`.
