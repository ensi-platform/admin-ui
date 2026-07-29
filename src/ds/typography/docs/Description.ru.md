Классы ролей текста. Family: **Inter** через `--aui-font-sans` (подключается с токенами).

```tsx
import { typographyStyles } from '@ensi-platform/admin-ui';
```

## Когда использовать

- наборный текст в примитивах и экранах АП
- compose `typographyStyles.*` в JSX; в своих CSS Modules не дублировать `font-*` / `line-height`
- базовый шрифт на корне уже задаёт `AdminUiProvider` через `--aui-font-sans`

## API (кратко)

| Class | Размер | Weight | Line-height |
| --- | --- | --- | --- |
| `bodyXs` | `--aui-font-size-xs` | regular | tight |
| `bodyS` | `--aui-font-size-sm` | regular | normal |
| `bodyM` | `--aui-font-size-md` | regular | normal |
| `bodyL` | `--aui-font-size-lg` | regular | normal |

Токены: `--aui-font-sans`, `--aui-font-size-*`, `--aui-font-weight-regular|medium|semibold`, `--aui-line-height-tight|normal`.

`label*` / `heading*` — позже.

## Пример

```tsx
<p className={typographyStyles.bodyM}>Текст интерфейса</p>
```
