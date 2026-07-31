`@ensi-platform/admin-ui` — UI для админ-панели Ensi.

## Установка

```bash
pnpm add @ensi-platform/admin-ui react react-dom
```

## Токены

Подключи CSS один раз в entry приложения:

```tsx
import '@ensi-platform/admin-ui/tokens';
```

## Provider

Один раз у корня UI — порталы, locale и встроенные строки:

```tsx
import { AdminUiProvider } from '@ensi-platform/admin-ui/provider';

<AdminUiProvider
    locale="ru-RU"
    labels={{
        close: t('aui.close'),
        clear: t('aui.clear'),
        confirm: t('aui.confirm'),
        cancel: t('aui.cancel'),
        delete: t('aui.delete'),
        notDelete: t('aui.notDelete'),
    }}
>
    <App />
</AdminUiProvider>
```

Подробнее — `Design System/Provider`.

## Тема

Тема задаётся на `document.documentElement`:

```ts
document.documentElement.setAttribute('data-theme', 'light'); // или 'dark'
```

Компоненты тему не знают — только CSS-переменные `--aui-*`.

## Первый компонент

```tsx
import { Button } from '@ensi-platform/admin-ui/button';

<Button variant="primary" size="md">
    Сохранить
</Button>
```

## Дальше

- **AI** — канал для агентов / skill
- `Base/Button` — базовые контролы
- `Form/Input` — поля и формы
- `Overlays/Modal` — модалки и оверлеи
- `Design System/Typography` — роли текста
