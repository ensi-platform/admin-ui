# Badge

> Статус: `ready`  
> База: `custom`  
> Пакет: `admin-ui-base`

## Зачем

Статус сущности в таблице / page header («В сборке», «Оплачен»). Read-only, не для MultiSelect.

## Хотим видеть

### Поведение

- [x] CSS Modules / `--aui-badge-*`
- [x] sizes sm | md
- [x] variants: neutral | success | warning | danger | info
- [x] pill, soft bg + fg

### API (черновик)

- `children`, `size`, `variant`, `dataTestId`, `className`
- `as` — нет
- без `onRemove`

### Состояния / визуал

- light + dark
- semantic status colors (не brand mint)

### Не в scope (v1)

- icon slot
- removable / Tag-поведение

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| `custom` | полный контроль токенов | руками | good |
| RAC | нет Badge | — | poor |

## Решение

| Поле | Значение |
| --- | --- |
| База | `custom` |
| Почему | статусный pill; отделён от Tag |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
