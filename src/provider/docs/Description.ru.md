Корневой провайдер пакета:

- изоляция порталов
- направление текста
- словарь встроенных строк
- подложка страницы (`--aui-page-bg-primary` / `--aui-page-fg-primary`)

```tsx
import { AdminUiProvider, useAuiLabels } from '@ensi-platform/admin-ui/provider';
```

## Когда использовать

- всегда — корень UI
- задаёт canvas приложения (фон и цвет текста); отступы контента — у host (`main`)

## API (кратко)

| Prop        | Значения              | По умолчанию | Описание           |
| ----------- | --------------------- | ------------ | ------------------ |
| `locale`    | `string`              | `ru-RU`      | BCP 47             |
| `direction` | `ltr` \| `rtl`        | из `locale`  | направление текста |
| `labels`    | `Partial<IAuiLabels>` | EN-дефолты   | встроенные строки  |
| `className` | `string`              | —            | корневой `div`     |

Хуки: `useAuiLabels()`, `useAuiLocale()`, `useAuiDirection()`.
