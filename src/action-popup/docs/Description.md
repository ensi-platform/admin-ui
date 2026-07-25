# ActionPopup / ConfirmModal / DeleteModal

Confirm-диалоги поверх `Modal`. Импорт:

```tsx
import { ActionPopup, ConfirmModal, DeleteModal } from '@ensi-platform/admin-ui-base';
```

## Когда использовать

- `ConfirmModal` — обычное подтверждение (primary)
- `DeleteModal` — удаление / необратимое (danger)
- `ActionPopup` — escape hatch со своими `tone` / labels (свои пресеты в АП)
- imperative: `useModal({ Component: DeleteModal, props: { … } })`

## API (кратко)

### ConfirmModal / DeleteModal

- `open` / `onOpenChange` / `onExitComplete`
- `title`, `children` (описание)
- `onConfirm` — `() => void | Promise<void>`; после resolve закрывается, при reject остаётся открытым
- `isConfirmDisabled?`, `dismissable?`, `dataTestId`

Кнопки и тексты зашиты (`IAuiLabels`: `confirm`/`cancel` или `delete`/`notDelete`).

### ActionPopup

То же + `tone` (`primary` | `danger`), обязательные `confirmLabel` / `cancelLabel`.

Size фиксирован `sm`, без `CloseButton`.

## Пример

```tsx
<DeleteModal
    open={open}
    onOpenChange={setOpen}
    title="Удалить роль?"
    onConfirm={async () => {
        await deleteRole(id);
    }}
>
    Действие необратимо.
</DeleteModal>
```

## Не делать

- не прокидывать `tone` / label-пропы в Confirm/Delete — для кастома берите `ActionPopup` или compose `Modal`
- не заводить `SaveModal` / `UntieModal` в base
- не копировать стили в АП
