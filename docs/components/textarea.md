# Textarea

> Статус: `ready`  
> База: `lib: react-aria-components` (`TextArea`)  
> Пакет: `admin-ui-base`

## Зачем

Многострочный текстовый контрол АП. FormTextArea — Field + RHF рядом с примитивом (не FormFieldWrapper).

## Хотим видеть

### Поведение

- [x] RAC `TextArea` + CSS Modules / `--aui-textarea-*`
- [x] sizes sm | md | lg
- [x] invalid / disabled / focus
- [x] без FieldContext — a11y через `useField().controlProps` снаружи
- [x] FormTextArea: `useFieldHook` + Field.Label / Hint / Error
- [x] `clear` → `onChange('')`, label из `useAuiLabels().clear`

### API (черновик)

- TextArea: `size`, `isInvalid`, `disabled`, `clear`, `dataTestId`, native/RAC props (`rows`, `placeholder`, …)
- FormTextArea: `name`, `label`, `hint`, `clear`, `size`, `disabled`, `dataTestId`
- `as` — нет
- без `variant`

### Состояния / визуал

- default / hover / focus / disabled / invalid
- light + dark

### Не в scope (v1)

- auto-resize / maxLength counter
- RAC `TextField` as root

## Сравнение библиотек

| Кандидат | Плюсы | Минусы | Fit |
| --- | --- | --- | --- |
| RAC `TextArea` | a11y states, наш shell Field | без label сам | good |
| RAC `TextField` | label/error из коробки | дублирует Field | poor |
| native `<textarea>` | просто | сами states/focus | ok |

## Решение

| Поле | Значение |
| --- | --- |
| База | `lib: react-aria-components` (`TextArea`) |
| Почему | примитив рядом с Field; FormTextArea закрывает RHF; паритет с Input |
| Дата | 2026-07-23 |

## Открытые вопросы

- —
