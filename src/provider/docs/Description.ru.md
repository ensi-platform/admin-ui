Корневой провайдер пакета:

- изоляция порталов
- направление текста
- словарь встроенных строк

```tsx
import { AdminUiProvider, useAuiLabels } from '@ensi-platform/admin-ui';
```

## Когда использовать

- всегда — корень UI

## API (кратко)

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `locale` | `string` | `ru-RU` | BCP 47 |
| `direction` | `ltr` \| `rtl` | из `locale` | направление текста |
| `labels` | `Partial<IAuiLabels>` | EN-дефолты | встроенные строки |
| `className` | `string` | — | корневой `div` |

Хуки: `useAuiLabels()`, `useAuiLocale()`, `useAuiDirection()`.
