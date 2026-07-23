# MultiSelect

> Статус: `ready`  
> База: `lib: react-aria-components` (`Select` + `selectionMode="multiple"`)  
> Пакет: `admin-ui-base`

## Зачем

Мультивыбор из справочника / enum в АП. FormMultiSelect — Field + RHF рядом. Trigger — Tag с remove по одному; `clear` — очистить всё.

## Хотим видеть

### Поведение

- [x] RAC `Select` `selectionMode="multiple"` + `--aui-multi-select-*`
- [x] `options: { value, label, disabled? }[]`
- [x] sizes sm | md | lg
- [x] invalid / disabled / focus
- [x] Tag в trigger + remove одного
- [x] `clear` → `onChange([])`, label из `useAuiLabels().clear`
- [x] FormMultiSelect: `useFieldHook` + Field.Label / Hint / Error

### API (черновик)

- MultiSelect: `options`, `value` / `onChange` (`TSelectValue[]`), `placeholder`, `clear`, `size`, `isInvalid`, `disabled`, `dataTestId`
- FormMultiSelect: `name`, `label`, `hint`, `options`, `clear`, `size`, `disabled`, `dataTestId`
- `as` — нет
- без compound Item / sections / typeahead

### Состояния / визуал

- default / hover / focus / disabled / invalid / open
- light + dark
- popover width = trigger; selected — Check
- trigger: min-height + wrap tags

### Не в scope (v1)

- ComboBox / typeahead / async
- sections / maxSelected
- Badge в trigger

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `Select` multiple | a11y, тот же shell что Select | verbose | good |
| Button + Popover + ListBox | гибко | больше glue | ok |
| `@base-ui/react` | headless | нельзя мешать с RAC | poor |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`Select` multiple) |
| Почему | value/onChange массив; Tag в trigger; Form как FormSelect |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
