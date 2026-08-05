Табы с подчёркиванием и скользящим индикатором.

```tsx
import { Tabs } from '@ensi-platform/admin-ui/tabs';
```

## Когда использовать

- разделы одной страницы или карточки сущности
- несколько связанных панелей контента на одном экране

## API (кратко)

| Prop           | Значения                  | По умолчанию | Описание                          |
| -------------- | ------------------------- | ------------ | --------------------------------- |
| `size`         | `sm` \| `md` \| `lg`      | `md`         | размер                            |
| `variant`      | `primary`                 | `primary`    | визуальный вариант                |
| `value`        | `string`                  | —            | выбранный таб (controlled)        |
| `defaultValue` | `string`                  | —            | начальный таб (uncontrolled)      |
| `onChange`     | `(value: string) => void` | —            | смена выбранного таба             |
| `disabled`     | `boolean`                 | `false`      | отключает все табы                |
| `dataTestId`   | `string`                  | —            | атрибут `data-test-id` для тестов |

Слоты: `Tabs.List` / `Tabs.Tab` (`id`, `disabled?`) / `Tabs.Panel` (`id`). У `Tab` и `Panel` `id` должен совпадать.
