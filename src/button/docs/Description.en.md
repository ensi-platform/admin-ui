Button for UI actions.

```tsx
import { Button } from '@ensi-platform/admin-ui';
```

## When to use

- primary / secondary / danger actions on a screen
- form submit (`type="submit"`)
- button look with navigation — use `as="a"` and `href`

## API (short)

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `variant` | `primary` \| `secondary` \| `danger` | `primary` | visual variant |
| `block` | `boolean` | `false` | full width of the parent |
| `icon` | `{ Component, after?, indent?, size?, className?, fill? }` | — | icon before or after the label (`after`) |
| `dataTestId` | `string` | — | `data-test-id` for tests |
| `as` | tag or component | `button` | root; for a link usually `as="a"` |

Native button/link attributes (`type`, `disabled`, `onClick`, `href`, …) are accepted for the chosen root element.

## Example

```tsx
<Button variant="primary" size="md" dataTestId="save">
    Save
</Button>

<Button as="a" href="/orders">
    To orders
</Button>
```
