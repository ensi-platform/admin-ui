Confirm dialogs on top of `Modal`.

```tsx
import { ActionPopup, ConfirmModal, DeleteModal } from '@ensi-platform/admin-ui';
```

## When to use

- `ConfirmModal` — regular confirmation (primary)
- `DeleteModal` — delete / irreversible action (danger)
- `ActionPopup` — custom `tone` / labels (presets in the app)
- imperative: `useModal({ Component: DeleteModal, props: { … } })`

## API (short)

### ConfirmModal / DeleteModal

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | whether the dialog is open |
| `onOpenChange` | `(open: boolean) => void` | — | open state change |
| `onExitComplete` | `() => void` | — | after the exit animation |
| `title` | `string` | — | title |
| `children` | `ReactNode` | — | description body |
| `onConfirm` | `() => void \| Promise<void>` | — | closes after resolve, stays open on reject |
| `isConfirmDisabled` | `boolean` | `false` | extra disable for the confirm button |
| `dismissable` | `boolean` | `true` | close on outside click |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Button labels come from `IAuiLabels` (`confirm`/`cancel` or `delete`/`notDelete`). Size is fixed to `sm`, no `CloseButton`.

### ActionPopup

Same as the presets, plus:

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `tone` | `primary` \| `danger` | `primary` | confirm button tone |
| `confirmLabel` | `string` | — | confirm button label |
| `cancelLabel` | `string` | — | cancel button label |

## Example

```tsx
<DeleteModal
    open={open}
    onOpenChange={setOpen}
    title="Delete role?"
    onConfirm={async () => {
        await deleteRole(id);
    }}
>
    This action cannot be undone.
</DeleteModal>
```
