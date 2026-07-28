# TimeField

> Статус: `ready`  
> База: `lib: react-aria-components` (`TimeField`)  
> Пакет: `admin-ui-base`

## Зачем

Поле ввода времени сегментами (без календаря) для форм АП.

## Хотим видеть

### Поведение

- [ ] RAC `TimeField` + Time segments
- [ ] FormTimeField + RHF
- [ ] `clear`, `hourCycle`, a11y

### API (черновик)

- `value` / `onChange`: `TimeValue | null`
- `size`, `variant`, `clear`, `dataTestId`
- FormTimeField: `name`, `label`, `hint`

### Состояния / визуал

- default / hover / focus / disabled / invalid
- light + dark

### Не в scope (v1)

- clock dial / picker popup
- timezone picker

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `TimeField` | a11y, locale segments | — | good |
| `type="time"` | native | locale/API слабее | poor |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`TimeField`) |
| Почему | сегменты + наш chrome |
| Дата | 2026-07-27 |

## Открытые вопросы

- —
