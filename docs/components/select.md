# Select

> Статус: `ready`  
> База: `lib: react-aria-components` (`Select` + `ListBox` + `Popover`)  
> Пакет: `admin-ui-base`

## Зачем

Single-select справочник / enum в АП. FormSelect — Field + RHF рядом с примитивом.

## Хотим видеть

### Поведение

- [x] RAC `Select` + CSS Modules / `--aui-select-*`
- [x] `options: { value, label, disabled? }[]`
- [x] sizes sm | md | lg
- [x] invalid / disabled / focus
- [x] `clear` → `onChange(null)`, label из `useAuiLabels().clear`
- [x] FormSelect: `useFieldHook` + Field.Label / Hint / Error

### API (черновик)

- Select: `options`, `value` / `onChange`, `placeholder`, `clear`, `size`, `isInvalid`, `disabled`, `dataTestId`
- FormSelect: `name`, `label`, `hint`, `options`, `clear`, `size`, `disabled`, `dataTestId`
- `as` — нет
- без compound `Select.Item` / sections

### Состояния / визуал

- default / hover / focus / disabled / invalid / open
- light + dark
- popover width = trigger; selected — Check

### Не в scope (v1)

- multi-select
- ComboBox / typeahead
- sections / groups
- custom option render / async load
- Input `clear` (тот же prop позже)

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `Select` | a11y, collections, наш shell Field | verbose внутри | good |
| native `<select>` | просто | слабый UI/a11y стилизация | poor |
| `@base-ui/react` Select | headless | нельзя мешать с RAC | poor |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`Select`) |
| Почему | options-first API; FormSelect как FormInput; стили наши |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
