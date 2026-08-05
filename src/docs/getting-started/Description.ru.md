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

Один раз у корня UI — порталы, locale, встроенные строки и page-подложка (фон/цвет текста; отступы контента — у host):

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
</AdminUiProvider>;
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
</Button>;
```

## Ссылки / роутер

Пакет роутер не знает: `Link` по умолчанию — обычный `<a>`. Идеальный случай в АП — один файл-обёртка с зашитым компонентом роутера; дальше в UI импортируете только свой `Link`.

```tsx
import { Link as AuiLink, type TLinkProps } from '@ensi-platform/admin-ui/link';
import { Link as RouterLink } from 'react-router';

export const Link = (props: Omit<TLinkProps<typeof RouterLink>, 'as'>) => <AuiLink as={RouterLink} {...props} />;
```

Для Next.js — тот же паттерн с `next/link` (проп `href` остаётся). Типы берутся у framework-компонента через `TLinkProps<typeof …>`. Вид кнопки с переходом — `Button` с `as`, не `Link`.

## Дальше

- **AI** — канал для агентов / skill
- `Base/Button` — базовые контролы
- `Base/Link` — текстовые ссылки
- `Form/Input` — поля и формы
- `Overlays/Modal` — модалки и оверлеи
- `Design System/Typography` — роли текста
