# Input

> Статус: `ready`  
> База: `lib: react-aria-components` (`Input`)  
> Пакет: `admin-ui-base`

## Зачем

Текстовый контрол АП. FormInput — Field + RHF рядом с примитивом (не FormFieldWrapper).

## Хотим видеть

### Поведение

- [x] RAC `Input` + CSS Modules / `--aui-input-*`
- [x] sizes sm | md | lg
- [x] invalid / disabled / focus
- [x] без FieldContext — a11y через `useField().controlProps` снаружи
- [x] FormInput: `useFieldHook` + Field.Label / Hint / Error
- [x] `clear` → `onChange('')`, label из `useAuiLabels().clear`

### API (черновик)

- Input: `size`, `isInvalid`, `disabled`, `clear`, `dataTestId`, native/RAC props
- FormInput: `name`, `label`, `hint`, `clear`, `size`, `disabled`, `dataTestId`
- `as` — нет
- без `variant` / prefix / suffix

### Состояния / визуал

- default / hover / focus / disabled / invalid
- light + dark

### Не в scope (v1)

- prefix / suffix
- Textarea / SearchInput
- RAC `TextField` as root

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `Input` | a11y states, наш shell Field | без label сам | good |
| RAC `TextField` | label/error из коробки | дублирует Field | poor |
| native `<input>` | просто | сами states/focus | ok |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`Input`) |
| Почему | примитив рядом с Field; FormInput закрывает RHF |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
