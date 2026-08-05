Диалоги подтверждения поверх `Modal`.

```tsx
import { ActionPopup, ConfirmModal, DeleteModal } from '@ensi-platform/admin-ui/action-popup';
```

## Когда использовать

- `ConfirmModal` — обычное подтверждение (primary)
- `DeleteModal` — удаление / необратимое действие (danger)
- `ActionPopup` — свои `tone` / подписи кнопок (пресеты в АП)
- через `useModal({ Component: DeleteModal, props: { … } })`

## API (кратко)

### ConfirmModal / DeleteModal

| Prop                | Значения                      | По умолчанию | Описание                                                |
| ------------------- | ----------------------------- | ------------ | ------------------------------------------------------- |
| `open`              | `boolean`                     | —            | открыт ли диалог                                        |
| `onOpenChange`      | `(open: boolean) => void`     | —            | смена состояния                                         |
| `onExitComplete`    | `() => void`                  | —            | после анимации закрытия                                 |
| `title`             | `string`                      | —            | заголовок                                               |
| `children`          | `ReactNode`                   | —            | описание в теле                                         |
| `onConfirm`         | `() => void \| Promise<void>` | —            | после resolve закрывается, при reject остаётся открытым |
| `isConfirmDisabled` | `boolean`                     | `false`      | дополнительно отключает кнопку подтверждения            |
| `dismissable`       | `boolean`                     | `true`       | закрытие по клику снаружи                               |
| `dataTestId`        | `string`                      | —            | атрибут `data-test-id` для тестов                       |

Подписи кнопок из `IAuiLabels` (`confirm`/`cancel` или `delete`/`notDelete`). Размер фиксирован `sm`, без `CloseButton`.

### ActionPopup

То же, что у пресетов, плюс:

| Prop           | Значения              | По умолчанию | Описание                   |
| -------------- | --------------------- | ------------ | -------------------------- |
| `tone`         | `primary` \| `danger` | `primary`    | тон кнопки подтверждения   |
| `confirmLabel` | `string`              | —            | текст кнопки подтверждения |
| `cancelLabel`  | `string`              | —            | текст кнопки отмены        |
