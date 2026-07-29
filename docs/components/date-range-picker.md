# DateRangePicker

> Статус: `ready`  
> База: `lib: react-aria-components` (`DateRangePicker`) + internal calendar  
> Пакет: `admin-ui`

## Зачем

Поле выбора диапазона дат (фильтры, отчёты) с тем же вертикальным календарём, что у DatePicker.

## Хотим видеть

### Поведение

- [ ] RAC `DateRangePicker` + start/end segments
- [ ] Shared vertical calendar, range highlight (start/end/in-range)
- [ ] FormDateRangePicker + RHF (`{ start, end }`)
- [ ] `clear`, min/max

### API (черновик)

- `value` / `onChange`: `RangeValue<DateValue> | null`
- `size`, `variant`, `clear`, `dataTestId`
- FormDateRangePicker: `name`, `label`, `hint`

### Состояния / визуал

- default / hover / focus / disabled / invalid
- light + dark

### Не в scope (v1)

- публичный RangeCalendar
- Kontur string API (`periodStartDate`)
- два независимых календаря side-by-side

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `DateRangePicker` | a11y, range state | pager calendar | good |
| Kontur DateRangePicker | scroll UX | string API | poor (только UX-реф) |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` + shared vertical calendar |
| Почему | единый chrome с DatePicker |
| Дата | 2026-07-27 |

## Открытые вопросы

- —
