# Toast

Transient-уведомления на RAC `UNSTABLE_Toast*`. Импорт: `import { ToastProvider, ToastRegion, useToast } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- короткий фидбек после save / delete / ошибки запроса
- стек нескольких сообщений (лимит через `ToastProvider` prop `maxVisibleToasts`, дефолт `5`)

`ToastProvider` + `ToastRegion` монтируются рядом с `ModalHub` (не внутри `AdminUiProvider` автоматически). Вызовы через `useToast()` → `{ appendToast, closeToast }`.

## API (кратко)

Status (`Toast`): semantic `variant`, без `size`.

### ToastProvider

- `maxVisibleToasts?`: number — макс. одновременно видимых тостов (дефолт `5`). Фиксируется при создании queue; смена prop после mount игнорируется
- `defaultTimeout?`: number — автозакрытие по умолчанию в ms (дефолт `5000`); `0` — sticky по умолчанию. Читается при каждом `appendToast`
- `children`

### Content (`appendToast`)

- `title`: string
- `description?`: string
- `variant?`: neutral | success | warning | danger | info (дефолт `neutral`)

### Options

- `timeout?`: number — перекрывает Provider `defaultTimeout`; `0` — без автозакрытия (sticky); `undefined` — берётся `defaultTimeout`
- `onClose?`: `() => void` — сразу при dismiss (не после анимации)

### useToast

- `appendToast(content, options?)` → `key`
- `closeToast(key)` — закрыть по ключу
- вне `ToastProvider` → throw
- сырой `UNSTABLE_ToastQueue` не реэкспортируется

### ToastRegion

- позиция по умолчанию: **top-end** (`position: fixed; top + inset-inline-end`, стек вниз)
- z-index: токен `--aui-toast-z` (дефолт `1050`); override в АП через `:root { --aui-toast-z: … }` или точечно `className` / `style` на Region
- длительность VT: токен `--aui-toast-duration-motion` (дефолт `200ms`); override в АП через CSS
- `dataTestId`, `className`, `style`
- без prop `placement` / `motionDuration` / `maxVisibleToasts`
- анимация: CSS View Transitions (`wrapUpdate` + `viewTransitionName`); без VT / при `prefers-reduced-motion` — мгновенное обновление без анимации
- клавиатура: тосты фокусируемы (`Tab` / landmarks) — контейнер тоста `tabIndex={0}`, с него можно дойти до кнопки закрытия; при фокусе/hover на регионе автозакрытие ставится на паузу
- монтировать **один** `ToastRegion` на Provider; два Region на одном queue дадут дубль UI

## Пример

```tsx
<AdminUiProvider>
    <ToastProvider maxVisibleToasts={3} defaultTimeout={4000}>
        <App />
        <ToastRegion />
    </ToastProvider>
</AdminUiProvider>
```

```tsx
import { useToast } from '@ensi-platform/admin-ui-base';

const { appendToast, closeToast } = useToast();

const key = appendToast({ title: 'Сохранено', variant: 'success' });

appendToast(
    { title: 'Ошибка', description: 'Не удалось сохранить', variant: 'danger' },
    { timeout: 8000, onClose: () => console.log('closed') }
);

closeToast(key);
```

## Не делать

- не копировать стили Toast в АП
- не реэкспортировать `UNSTABLE_*` из RAC
- не добавлять `toast.success` / хелперы в base — только `useToast` + `ToastProvider` + `ToastRegion`
- не монтировать несколько `ToastRegion` на один Provider
- не вызывать `useToast` вне `ToastProvider`
