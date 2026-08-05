Плоский список пунктов меню с группами (uppercase label) и soft-pill active.

```tsx
import { MenuList } from '@ensi-platform/admin-ui/menu-list';
```

## Когда использовать

- список разделов в сайдбаре или вторичной навигации
- группы + leaf-пункты без вложенного accordion
- готовая колонка с logo/user/collapse — см. `CascadeMenu`

## API (кратко)

### MenuList

| Prop           | Значения                  | По умолчанию | Описание                                 |
| -------------- | ------------------------- | ------------ | ---------------------------------------- |
| `value`        | `string`                  | —            | id активного пункта (только управляемый) |
| `defaultValue` | `string`                  | —            | начальный активный пункт                 |
| `onChange`     | `(value: string) => void` | —            | смена активного                          |
| `size`         | `sm` \| `md` \| `lg`      | `md`         | размер                                   |
| `variant`      | `primary`                 | `primary`    | визуальный вариант                       |
| `collapsed`    | `boolean`                 | `false`      | только иконки (лейблы скрыты)            |
| `disabled`     | `boolean`                 | `false`      | отключает все пункты                     |
| `dataTestId`   | `string`                  | —            | атрибут `data-test-id`                   |

Слоты: `MenuList.Group` / `MenuList.Item`.

### MenuList.Group

| Prop    | Значения | По умолчанию | Описание       |
| ------- | -------- | ------------ | -------------- |
| `label` | `string` | —            | подпись группы |

### MenuList.Item

| Prop         | Значения     | По умолчанию   | Описание                        |
| ------------ | ------------ | -------------- | ------------------------------- |
| `id`         | `string`     | —              | уникальный id                   |
| `icon`       | `TSVGRIcon`  | —              | иконка слева                    |
| `href`       | `string`     | —              | ссылка; корень по умолчанию `a` |
| `as`         | element type | `a` / `button` | полиморфный корень              |
| `disabled`   | `boolean`    | `false`        | отключает пункт                 |
| `dataTestId` | `string`     | —              | атрибут `data-test-id`          |
