Visibility and order of named items: list filters or table columns. Opened apart from `Filters` and `Table`.

```tsx
import { ArrangementSettings } from '@ensi-platform/admin-ui/arrangement-settings';
```

## When to use

- the user chooses which filters or columns are visible and in which order
- filter values stay in `Filters`, columns stay in `Table`

## API (short)

| Prop           | Values                            | Default | Description                                 |
| -------------- | --------------------------------- | ------- | ------------------------------------------- |
| `open`         | `boolean`                         | —       | whether the `Drawer` is open                |
| `onOpenChange` | `(open: boolean) => void`         | —       | open change; cancel and dismiss do not save |
| `title`        | `string`                          | —       | drawer title                                |
| `placement`    | `left` \| `right`                 | `left`  | side the `Drawer` enters from               |
| `items`        | `{ id: string; label: string }[]` | —       | every item, including hidden ones           |
| `value`        | `string[]`                        | —       | visible ids in the current order            |
| `onSave`       | `(value: string[]) => void`       | —       | commit the draft                            |
| `dataTestId`   | `string`                          | —       | `data-test-id`                              |

The draft is copied when the drawer opens. Drag the whole row, including its side plate, and only that row moves: the checkbox shows the item and is not part of the drag. An insertion line appears between rows, and an elevated copy of the row follows the pointer. A hidden item stays in the list. Save commits only checked ids, in list order.
