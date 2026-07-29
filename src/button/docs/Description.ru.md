Кнопка для действий в интерфейсе.

```tsx
import { Button } from '@ensi-platform/admin-ui';
```

## Когда использовать

- основное / второстепенное / опасное действие на экране
- отправка формы (`type="submit"`)
- вид кнопки, но переход по ссылке — через `as="a"` и `href`

## API (кратко)

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `variant` | `primary` \| `secondary` \| `danger` | `primary` | визуальный вариант |
| `block` | `boolean` | `false` | на всю ширину родителя |
| `icon` | `{ Component, after?, indent?, size?, className?, fill? }` | — | иконка слева или справа (`after`) |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |
| `as` | тег или компонент | `button` | корень; для ссылки обычно `as="a"` |

Обычные атрибуты кнопки/ссылки (`type`, `disabled`, `onClick`, `href`, …) принимаются как у выбранного корневого элемента.
