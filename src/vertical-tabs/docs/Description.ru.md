Вертикальные вкладки: колонка слева, панель справа.

```tsx
import { VerticalTabs } from '@ensi-platform/admin-ui/vertical-tabs';
```

## Когда использовать

- секции внутри одной вкладки страницы, когда полей слишком много для одной колонки
- выбор секции меняет панель рядом, а не всю страницу

Разделы самой страницы — `Tabs`.

## API (кратко)

| Prop           | Значения                  | По умолчанию | Описание                          |
| -------------- | ------------------------- | ------------ | --------------------------------- |
| `size`         | `sm` \| `md` \| `lg`      | `md`         | размер                            |
| `variant`      | `primary`                 | `primary`    | визуальный вариант                |
| `value`        | `string`                  | —            | выбранный пункт (controlled)      |
| `defaultValue` | `string`                  | —            | начальный пункт (uncontrolled)    |
| `onChange`     | `(value: string) => void` | —            | смена выбранного пункта           |
| `disabled`     | `boolean`                 | `false`      | отключает все пункты              |
| `dataTestId`   | `string`                  | —            | атрибут `data-test-id` для тестов |

Слоты: `VerticalTabs.List` / `VerticalTabs.Item` (`id`, `disabled?`) / `VerticalTabs.Panels` / `VerticalTabs.Panel` (`id`). У `Item` и `Panel` `id` должен совпадать.

Ширину колонки, зазор и заливку выбранного пункта меняют `--aui-vertical-tabs-*` или `className` на корне, списке и пункте.

`VerticalTabs` не пишет выбор в адрес и не хранит его вне компонента. Если нужно, синхронизируйте через `value` / `onChange`.

Слота счётчика ошибок нет. Бейдж кладётся в `VerticalTabs.Item` как часть `children` (`Badge` с `variant="danger"`). Число должно быть текстом и иметь `aria-label`: состояние нельзя передать только цветом.
