# Checkbox

> Статус: `ready`  
> База: `lib: react-aria-components` (`Checkbox`)  
> Пакет: `admin-ui-base`

## Зачем

Boolean-флаги в АП. FormCheckbox — Field + RHF рядом с примитивом. Группа — отдельный `CheckboxGroup`.

## Хотим видеть

### Поведение

- [x] RAC `Checkbox` + `--aui-checkbox-*`
- [x] sizes sm | md | lg
- [x] invalid / disabled / focus / indeterminate
- [x] item-лейбл = `children`
- [x] FormCheckbox (boolean)
- [x] без зависимости от CheckboxGroup (size/context)

### API (черновик)

- Checkbox: `checked`, `onChange(boolean)`, `indeterminate`, `value` (для Group), `children`, `size`, `disabled`, `isInvalid`, `dataTestId`
- FormCheckbox: `name`, `hint`, `children` (без Field.Label)
- `as` — нет

### Состояния / визуал

- default / hover / focus / selected / indeterminate / disabled / invalid
- light + dark

### Не в scope (v1)

- Radio / RadioGroup
- clear / variant
- авто-`aria-label` из string children
- CheckboxGroup — см. `checkbox-group.md`

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC Checkbox | a11y, group-ready через `value` | — | good |
| native input | просто | сами states | ok |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`Checkbox`) |
| Почему | соло boolean; group вынесен в checkbox-group |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
