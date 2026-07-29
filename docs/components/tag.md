# Tag

> Статус: `ready`  
> База: `custom`  
> Пакет: `admin-ui`

## Зачем

Метка / фильтр-чип: выбранные значения в MultiSelect, активные фильтры. Нейтральный chrome + optional remove.

## Хотим видеть

### Поведение

- [x] CSS Modules / `--aui-tag-*`
- [x] sizes sm | md
- [x] `onRemove` → крестик, `aria-label` из `useAuiLabels().clear`
- [x] disabled

### API (черновик)

- `children`, `size`, `onRemove?`, `disabled?`, `dataTestId`, `className`
- `as` — нет
- без status-variants (это Badge)

### Состояния / визуал

- rectangular + control radius, border + muted bg
- light + dark

### Не в scope (v1)

- selection mode / TagGroup как публичный API
- status colors

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| `custom` | наш API, токены | a11y remove сами | good |
| RAC `Tag` | a11y коллекции | verbose; нужен TagGroup | ok (внутри MultiSelect) |

## Решение

| Поле | Значение |
| --- | --- |
| База | `custom` (+ RAC Tag внутри MultiSelect) |
| Почему | фильтры / метки; Badge отдельно |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
