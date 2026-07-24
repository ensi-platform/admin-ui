# Field

> Статус: `ready`
> База: `custom` + `lib: react-aria-components` (`Label` / `Text`)
> Пакет: `admin-ui-base`

## Зачем

Обертка label / hint / error вокруг любого контрола (замена FormControl). Без RHF — state и `name` остаются у Form / FormX.

## Хотим видеть

### Поведение

- [x] compound: `Field.Label` / `Field.Hint` / `Field.Error`
- [x] a11y: `htmlFor` + `useField().controlProps` (`aria-describedby` / `aria-invalid`)
- [x] typography через `typographyStyles` (не font в Field CSS)
- [x] работает вне Form и с любым контролом

### API (черновик)

- `size`: `sm` | `md` | `lg` (gap + Label/Hint/Error typography)
- `invalid`, `disabled`
- `dataTestId`
- `useField().controlProps` на контрол
- `as` — нет
- без `label` / `hint` / `error` / `name` пропов на root
- без `Field.Control` / cloneElement
- без `font-*` / reset в CSS Modules Field

### Состояния / визуал

- default / disabled / invalid
- light + dark (через semantic tokens)

### Не в scope (v1)

- стили Input (см. Input)
- FormSelect / другие FormX

## Сравнение библиотек

| Кандидат                  | Плюсы                  | Минусы              | Fit  |
| ------------------------- | ---------------------- | ------------------- | ---- |
| `custom` + RAC Label/Text | наш API, generic shell | a11y ids сами       | good |
| RAC `TextField` as root   | a11y из коробки        | только text input   | poor |
| `@base-ui/react` Field    | готовый compound       | нельзя мешать с RAC | poor |

## Решение

| Поле   | Значение                                                            |
| ------ | ------------------------------------------------------------------- |
| База   | `custom` root/context + RAC `Label` / `Text`                        |
| Почему | FormControl-замена над любым контролом; RAC TextField слишком узкий |
| Дата   | 2026-07-23                                                          |

## Открытые вопросы

- —
