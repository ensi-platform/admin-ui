# CheckboxGroup

> Статус: `ready`  
> База: `lib: react-aria-components` (`CheckboxGroup`)  
> Пакет: `admin-ui-base`

## Зачем

Набор опций `string[]` в АП. FormCheckboxGroup — Field + RHF. Вёрстка items — снаружи. Items — примитив `Checkbox` (без size-context).

## Хотим видеть

### Поведение

- [x] RAC `CheckboxGroup` + `--aui-checkbox-group-gap-md`
- [x] value `string[]`; items через `Checkbox value=`
- [x] свободная вёрстка children
- [x] FormCheckboxGroup: `label` / Hint / Error
- [x] без size-inherit на Checkbox

### API (черновик)

- CheckboxGroup: `value`, `onChange`, `children`, `size` (chrome), `disabled`, `isInvalid`, `dataTestId`
- FormCheckboxGroup: `name`, `label`, `hint`, `children`
- `as` — нет

### Состояния / визуал

- default / disabled / invalid
- light + dark

### Не в scope (v1)

- RadioGroup
- авто-layout сетка items
- size context → Checkbox

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC CheckboxGroup | a11y + selection context | — | good |
| свой state + соло Checkbox | полный контроль | дубль a11y | ok |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`CheckboxGroup`) |
| Почему | selection/a11y у RAC; layout снаружи; отделён от Checkbox |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
