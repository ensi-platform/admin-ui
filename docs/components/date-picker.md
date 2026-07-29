# DatePicker

> Статус: `ready`  
> База: `lib: react-aria-components` (`DatePicker`) + internal calendar  
> Пакет: `admin-ui`

## Зачем

Поле выбора одной даты (и datetime через `granularity`) в формах АП. Календарь в попапе — вертикальный скролл месяцев (реф Kontur UI).

## Хотим видеть

### Поведение

- [ ] RAC `DatePicker` + DateInput segments + Popover
- [ ] Vertical virtualized calendar (Kontur-like), `scrollToMonth` on open
- [ ] `granularity` для datetime
- [ ] FormDatePicker + RHF
- [ ] `clear`, min/max, a11y keyboard

### API (черновик)

- `value` / `onChange`: `DateValue | null` (`@internationalized/date`)
- `size`, `variant`, `clear`, `dataTestId`, `granularity`
- FormDatePicker: `name`, `label`, `hint`

### Состояния / визуал

- default / hover / focus / disabled / invalid
- light + dark

### Не в scope (v1)

- публичный Calendar
- отдельный DateTimePicker
- ISO / `dd.mm.yyyy` string value
- Kontur wheel-animation 1:1

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `DatePicker` | a11y, i18n, сегменты | календарь pager по умолчанию | good |
| Kontur DatePicker | знакомый scroll UX | чужой API, string values | poor (только UX-реф) |
| custom input mask | просто | a11y слабее | poor |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` + custom month grids (not RAC CalendarGrid) |
| Почему | наш API + RAC DatePicker state; calendar UX как Kontur |
| Дата | 2026-07-27 |

## Открытые вопросы

- —
