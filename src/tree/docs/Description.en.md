A tree of nested rows: the chevron expands a branch, and pressing a row selects it.

```tsx
import { Tree } from '@ensi-platform/admin-ui/tree';
```

## When to use

- a hierarchy where branches expand and a row is selected separately
- one selected node, or several
- not a flat menu — see `MenuList`
- not a short list of values — see `Select`

## API (short)

| Prop                  | Values                                  | Default  | Description                                                                                                                                    |
| --------------------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`               | `{ id, label, children?, disabled? }[]` | —        | nodes. An empty or omitted `children` is a leaf. `disabled` blocks selection and expansion of that node                                        |
| `aria-label`          | `string`                                | —        | accessible name. The tree has no visible caption                                                                                               |
| `selectionMode`       | `none` \| `single` \| `multiple`        | `single` | selection mode. In `single`, pressing the selected row again keeps it. In `multiple`, pressing it again clears it. An empty key set is allowed |
| `selectedKeys`        | `Selection`                             | —        | selected keys                                                                                                                                  |
| `defaultSelectedKeys` | `Selection`                             | —        | initial selection without external state                                                                                                       |
| `onSelectionChange`   | `(keys) => void`                        | —        | selection handler. Not called when `disabled` or `readOnly`                                                                                    |
| `expandedKeys`        | `Iterable<Key>`                         | —        | expanded branches                                                                                                                              |
| `defaultExpandedKeys` | `Iterable<Key>`                         | —        | initial expansion without external state                                                                                                       |
| `onExpandedChange`    | `(keys) => void`                        | —        | expansion handler                                                                                                                              |
| `disabled`            | `boolean`                               | `false`  | no node can be selected or expanded. Wins over `readOnly`                                                                                      |
| `readOnly`            | `boolean`                               | `false`  | the selection stays visible and does not change. Branches still expand                                                                         |
| `dataTestId`          | `string`                                | —        | `data-test-id` attribute                                                                                                                       |
