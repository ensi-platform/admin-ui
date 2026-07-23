# Switch

> Статус: `ready`  
> База: `lib: react-aria-components` (`Switch`)  
> Пакет: `admin-ui-base`

## Зачем

On/off тумблер настроек в АП. FormSwitch — Field + RHF рядом с примитивом.

## Хотим видеть

### Поведение

- [x] RAC `Switch` + `--aui-switch-*`
- [x] sizes sm | md | lg
- [x] invalid / disabled / focus
- [x] лейбл = `children`
- [x] FormSwitch: boolean через `useFieldHook`

### API (черновик)

- Switch: `checked`, `onChange(boolean)`, `children`, `size`, `disabled`, `isInvalid`, `dataTestId`
- FormSwitch: `name`, `hint`, `children` (без Field.Label)
- `as` — нет; без Group

### Состояния / визуал

- default / hover / focus / selected / disabled / invalid
- light + dark

### Не в scope (v1)

- SwitchGroup
- clear / variant
- авто-`aria-label` из string children

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `Switch` | a11y toggle | — | good |
| Checkbox as toggle | уже есть | другая семантика | poor |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`Switch`) |
| Почему | role switch + паритет с Checkbox API |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
