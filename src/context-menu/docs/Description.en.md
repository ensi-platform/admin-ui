Fixed cursor menu (RMB / coordinates): portal, dismiss on outside click and Escape.

```tsx
import { ContextMenu } from '@ensi-platform/admin-ui/context-menu';
```

## When to use

- actions on right-click for a row, nav item, or cell
- short command list (pin, open in new tab, delete)
- not for menus from a button trigger — see `Popover`

## API (short)

### ContextMenu

| Prop           | Values               | Default   | Description                              |
| -------------- | -------------------- | --------- | ---------------------------------------- |
| `open`         | `boolean`            | `false`   | whether the menu is open                 |
| `x`            | `number`             | —         | left position (viewport px)              |
| `y`            | `number`             | —         | top position (viewport px)               |
| `onClose`      | `() => void`         | —         | close (outside / Escape)                 |
| `size`         | `sm` \| `md` \| `lg` | `md`      | size                                     |
| `variant`      | `primary`            | `primary` | visual variant                           |
| `children`     | `ReactNode`          | —         | `ContextMenu.Item` / `Separator` entries |
| `onMouseEnter` | `() => void`         | —         | pointer enters menu surface              |
| `dataTestId`   | `string`             | —         | `data-test-id`                           |

### ContextMenu.Item

| Prop         | Values      | Default | Description    |
| ------------ | ----------- | ------- | -------------- |
| `children`   | `ReactNode` | —       | label          |
| `icon`       | SVGR        | —       | leading icon   |
| `disabled`   | `boolean`   | `false` | disabled item  |
| `onClick`    | handler     | —       | action         |
| `dataTestId` | `string`    | —       | `data-test-id` |

### ContextMenu.Separator

| Prop         | Values   | Default | Description    |
| ------------ | -------- | ------- | -------------- |
| `dataTestId` | `string` | —       | `data-test-id` |
