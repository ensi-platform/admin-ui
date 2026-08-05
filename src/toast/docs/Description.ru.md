Transient-уведомления на RAC `UNSTABLE_Toast*`.

```tsx
import { ToastProvider, ToastRegion, useToast } from '@ensi-platform/admin-ui';
```

## Когда использовать

- короткий фидбек после сохранения, удаления или ошибки запроса
- стек нескольких сообщений (лимит через `maxVisibleToasts` на `ToastProvider`, по умолчанию `5`)

`ToastProvider` и `ToastRegion` монтируются рядом с `ModalHub` (не внутри `AdminUiProvider` автоматически). Вызовы через `useToast()` → `{ appendToast, closeToast }`.

## API (кратко)

Status (`Toast`): semantic `variant`, без `size`.

### ToastProvider

| Prop               | Значения    | По умолчанию | Описание                                                                                          |
| ------------------ | ----------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `maxVisibleToasts` | `number`    | `5`          | макс. одновременно видимых тостов; фиксируется при создании queue, смена после mount игнорируется |
| `defaultTimeout`   | `number`    | `5000`       | автозакрытие по умолчанию в ms; `0` — sticky по умолчанию; читается при каждом `appendToast`      |
| `children`         | `ReactNode` | —            | содержимое приложения                                                                             |

### Content (`appendToast`)

| Prop          | Значения                                                  | По умолчанию | Описание                       |
| ------------- | --------------------------------------------------------- | ------------ | ------------------------------ |
| `title`       | `string`                                                  | —            | основной текст                 |
| `description` | `string`                                                  | —            | вторичный текст под заголовком |
| `variant`     | `neutral` \| `success` \| `warning` \| `danger` \| `info` | `neutral`    | semantic статус                |

### Options

| Prop      | Значения     | По умолчанию     | Описание                                             |
| --------- | ------------ | ---------------- | ---------------------------------------------------- |
| `timeout` | `number`     | `defaultTimeout` | перекрывает `defaultTimeout`; `0` — без автозакрытия |
| `onClose` | `() => void` | —                | сразу при dismiss (не после анимации)                |

### useToast

- `appendToast(content, options?)` → `key`
- `closeToast(key)` — закрыть по ключу
- вне `ToastProvider` → throw
- сырой `UNSTABLE_ToastQueue` не реэкспортируется

### ToastRegion

- позиция по умолчанию: **top-end** (`position: fixed; top + inset-inline-end`, стек вниз)
- z-index: токен `--aui-toast-z` (по умолчанию `1050`); override в АП через `:root { --aui-toast-z: … }` или `className` / `style` на Region
- длительность VT: токен `--aui-toast-duration-motion` (по умолчанию `200ms`); override в АП через CSS
- `dataTestId`, `className`, `style`
- без prop `placement` / `motionDuration` / `maxVisibleToasts`
- анимация: CSS View Transitions (`wrapUpdate` + `viewTransitionName`); без VT / при `prefers-reduced-motion` — мгновенное обновление
- клавиатура: тосты фокусируемы (`Tab` / landmarks) — контейнер тоста `tabIndex={0}`, с него можно дойти до кнопки закрытия; при фокусе/hover на регионе автозакрытие на паузе
- монтировать **один** `ToastRegion` на Provider; два Region на одном queue дадут дубль UI
