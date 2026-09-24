Таблица списка: сортировка и фильтр колонки собраны внутри. Меню действий — `ContextMenu` рядом, его открывает сборка. Хром берётся из `Table`.

```tsx
import { ContextMenu } from '@ensi-platform/admin-ui/context-menu';
import { DataTable } from '@ensi-platform/admin-ui/data-table';
```

## Когда использовать

- список сущностей, где сортировка и фильтр колонки живут в шапке
- строка с меню действий
- голый хром без этой склейки — `Table`

## API (кратко)

| Prop           | Значения                | По умолчанию | Описание                             |
| -------------- | ----------------------- | ------------ | ------------------------------------ |
| `size`         | `sm` \| `md` \| `lg`    | `md`         | плотность строк                      |
| `block`        | `boolean`               | `true`       | ширина 100% родителя                 |
| `hasChecked`   | `boolean`               | `false`      | резерв под колонку чекбоксов         |
| `zebra`        | `boolean`               | `false`      | слабый фон чётных строк              |
| `sort`         | `{ column, direction }` | —            | одна активная колонка                |
| `onSortChange` | функция                 | —            | следующая сортировка или `undefined` |
| `dataTestId`   | `string`                | —            | атрибут `data-test-id` для тестов    |

Слоты: `Header` / `Body` / `Footer` / `Row` / `Cell` / `HeaderCell` / `CheckboxCell` / `HeaderCheckboxCell` / `Filter` / `Actions` / `Pagination` / `PageSize`.

- Корень сам рисует область прокрутки и `<table>`. `Header` и `Body` внутри таблицы, `Footer` снаружи
- `HeaderCell`: `column` и `sortable`. Без `Filter` сортировка — нажатие по заголовку (`none` → `asc` → `desc` → `none`). Смена колонки сбрасывает предыдущую
- `Filter` — тело дропа внутри `HeaderCell`. `active` красит иконку. Нет слота — дропа нет. Если колонка `sortable`, пункты сортировки под фильтром
- `Row` `onContextMenu` — правый клик, тот же проп, что у строки `Table`. Строка сама меню не открывает
- `Actions` — тихая кнопка «⋯» с `onClick`. Всегда видна, без заливки. Что открывать, решает сборка строки
- `Pagination` и `PageSize` — как у `Table`, обычно внутри `Footer`
