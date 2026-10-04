Underline tabs with a sliding indicator.

```tsx
import { Tabs } from '@ensi-platform/admin-ui/tabs';
```

## When to use

- sections of a page or entity card
- several related content panels on one screen

## API (short)

| Prop           | Values                    | Default   | Description                |
| -------------- | ------------------------- | --------- | -------------------------- |
| `size`         | `sm` \| `md` \| `lg`      | `md`      | size                       |
| `variant`      | `primary`                 | `primary` | visual variant             |
| `value`        | `string`                  | —         | selected tab (controlled)  |
| `defaultValue` | `string`                  | —         | initial tab (uncontrolled) |
| `onChange`     | `(value: string) => void` | —         | selection change           |
| `disabled`     | `boolean`                 | `false`   | disables all tabs          |
| `dataTestId`   | `string`                  | —         | `data-test-id` for tests   |

Slots: `Tabs.List` / `Tabs.Tab` (`id`, `disabled?`) / `Tabs.Panel` (`id`). `Tab` and `Panel` `id`s must match.

Nested `Tabs` are sections inside a tab panel. They differ from the top level only by `size="sm"`.

`Tabs` does not write the selection into the URL and does not store it outside the component. Sync it with `value` / `onChange` when you need to.

There is no vertical mode and no second visual level. A side section menu is built by the consumer on `react-aria-components`.

There is no error-count slot. Put a badge in `Tabs.Tab` as part of `children` (`Badge` with `variant="danger"`). The number must be text and have an `aria-label`: state must not be color alone.

```tsx
<Tabs.Tab id="profile">
    Profile
    <Badge size="sm" variant="danger" aria-label="3 errors">
        3
    </Badge>
</Tabs.Tab>
```
