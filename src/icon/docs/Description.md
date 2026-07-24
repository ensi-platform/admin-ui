# Icon

Примитив SVGR-иконки. Импорт: `import { Icon } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- иконка внутри Button и других примитивов через `IIconButtonProps`
- декоративная SVG с размером / fill через CSS vars

## API (кратко)

- `Component`: SVGR-компонент
- `size?`, `fill?`, `className?`
- `after?`, `indent?` — layout для родителя (Button); Icon их игнорирует

## Пример

```tsx
<Icon Component={Clear} size={16} />
```

## Не делать

- не копировать стили компонента в АП
- не дублировать примитив обёрткой без нужды
