# NumberInput

> Статус: `ready`  
> База: `lib: react-aria-components` (`NumberField`)  
> Пакет: `admin-ui-base`

## Зачем

Числовой ввод АП. Деньги/единицы — через `transform` (store↔view) + `suffix`, без отдельного MoneyInput.

## Хотим видеть

### Поведение

- [x] RAC `NumberField` + Group + наш Input (borderless внутри)
- [x] prefix / suffix
- [x] `min` / `max` / `step` на view
- [x] FormNumberInput + optional `transform`
- [x] `createScaleTransform` / `kopecksTransform`
- [x] `clear` → `onChange(null)`, label из `useAuiLabels().clear`

### API (черновик)

- NumberInput: `value`/`onChange` number|null, size, prefix/suffix, `clear`, dataTestId
- FormNumberInput: name, label, hint, transform, `clear`
- stepper — нет

### Состояния / визуал

- default / hover / focus / disabled / invalid
- light + dark

### Не в scope (v1)

- stepper buttons
- MoneyInput / currency select
- prefix/suffix на текстовом Input
- кастомная маска тысяч сверх RAC locale

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `NumberField` | locale, a11y, step | stepper лишний | good |
| `type="number"` | просто | locale/a11y слабее | poor |
| react-number-format | маски | лишняя dep | ok later |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`NumberField`) |
| Почему | числа + transform для денег/единиц |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
