# Typography

Классы ролей текста. Импорт: `import { typographyStyles } from '@ensi-platform/admin-ui-base'`.

## Контракт

- **Снаружи (tokens):** значения шкалы в CSS vars на `:root`
- **Классы:** фиксированный список ролей; только `var(--aui-…)`, без литералов
- **Примитивы пакета:** compose `typographyStyles.*` в JSX; в своих CSS Modules не дублировать `font-*` / `line-height`

## Переменные (v1)

| Var                                                   | Роль        |
| ----------------------------------------------------- | ----------- |
| `--aui-font-sans`                                     | family      |
| `--aui-font-size-xs` \| `sm` \| `md` \| `lg`          | size        |
| `--aui-font-weight-regular` \| `medium` \| `semibold` | weight      |
| `--aui-line-height-tight` \| `normal`                 | line-height |

## Классы (v1)

| Class    | Vars                                                 |
| -------- | ---------------------------------------------------- |
| `bodyXs` | sans + size-xs + weight-regular + line-height-tight  |
| `bodyS`  | sans + size-sm + weight-regular + line-height-normal |
| `bodyM`  | sans + size-md + weight-regular + line-height-normal |
| `bodyL`  | sans + size-lg + weight-regular + line-height-normal |

`label*` / `heading*` — later.

## Пример

```tsx
<p className={typographyStyles.bodyM}>Body text</p>
```

## Не делать

- не писать `font-size` / `font-family` литералами в `typography/styles.module.css`
- не копировать font-стек в CSS Modules Button / Field / …
- не прокидывать typography через `AdminUiProvider` context
