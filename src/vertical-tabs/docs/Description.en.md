Vertical tabs: a column on the left and a panel on the right.

```tsx
import { VerticalTabs } from '@ensi-platform/admin-ui/vertical-tabs';
```

## When to use

- sections inside one page tab, when one column of fields is too long
- choosing a section replaces the panel beside it, not the whole page

Page sections use `Tabs`.

## API (short)

| Prop           | Values                    | Default | Description                |
| -------------- | ------------------------- | ------- | -------------------------- |
| `size`         | `sm` \| `md` \| `lg`      | `md`    | size                       |
| `variant`      | `primary`                 | `primary` | visual variant           |
| `value`        | `string`                  | —       | selected item (controlled) |
| `defaultValue` | `string`                  | —       | initial item (uncontrolled) |
| `onChange`     | `(value: string) => void` | —       | selection change           |
| `disabled`     | `boolean`                 | `false` | disables every item        |
| `dataTestId`   | `string`                  | —       | `data-test-id` for tests   |

Slots: `VerticalTabs.List` / `VerticalTabs.Item` (`id`, `disabled?`) / `VerticalTabs.Panels` / `VerticalTabs.Panel` (`id`). `Item` and `Panel` `id`s must match.

Column width, gap, and the selected fill come from `--aui-vertical-tabs-*` or `className` on the root, list, and item.

`VerticalTabs` does not write the selection into the URL and does not store it outside the component. Sync it with `value` / `onChange` when you need to.

There is no error-count slot. Put a badge in `VerticalTabs.Item` as part of `children` (`Badge` with `variant="danger"`). The number must be text and have an `aria-label`: state must not be color alone.
