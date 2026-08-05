Классы ролей текста. Family: **Inter** через `--aui-font-sans` (подключается с токенами). Root `AdminUiProvider` фиксирует `font-size: 16px` (база rem).

```tsx
import { typographyStyles } from '@ensi-platform/admin-ui/typography';
```

## Когда использовать

- наборный текст в примитивах и экранах АП
- compose `typographyStyles.*` в JSX; в своих CSS Modules не дублировать `font-*` / `line-height`
- базовый шрифт на корне уже задаёт `AdminUiProvider` через `--aui-font-sans`
- заголовок страницы списка / detail — `headingM` (или `headingL`)

## API (кратко)

| Class        | Размер                | Weight   | Line-height               |
| ------------ | --------------------- | -------- | ------------------------- |
| `bodyXs`     | `--aui-font-size-xs`  | regular  | `--aui-line-height-xs`    |
| `bodyS`      | `--aui-font-size-sm`  | regular  | `--aui-line-height-sm`    |
| `bodySTight` | `--aui-font-size-sm`  | regular  | `--aui-line-height-tight` |
| `bodyM`      | `--aui-font-size-md`  | regular  | `--aui-line-height-md`    |
| `bodyL`      | `--aui-font-size-lg`  | regular  | `--aui-line-height-lg`    |
| `headingM`   | `--aui-font-size-xl`  | semibold | `--aui-line-height-xl`    |
| `headingL`   | `--aui-font-size-2xl` | semibold | `--aui-line-height-2xl`   |

Токены: `--aui-font-sans`, `--aui-font-size-xs…2xl`, `--aui-font-weight-regular|medium|semibold`, `--aui-line-height-xs…2xl|tight|normal`.

`label*` — позже.

## Пример

```tsx
<h1 className={typographyStyles.headingM}>Заказы</h1>
<p className={typographyStyles.bodyM}>Текст интерфейса</p>
```
