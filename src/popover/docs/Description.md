# Popover

Оверлей у триггера с интерактивным контентом. Импорт: `import { Popover } from '@ensi-platform/admin-ui'`.

## Когда использовать

- панель по клику: фильтры, меню действий, короткая форма
- не для простой текстовой подсказки — там `Tooltip`

## API (кратко)

### Popover

- RAC `DialogTrigger`: `isOpen` / `defaultOpen` / `onOpenChange`, children

### Popover.Trigger

- обёртка `Pressable` для нашего `Button` / кастомного триггера

### Popover.Content

- `size`: sm | md | lg
- `variant`: primary
- `arrow` — стрелка к триггеру
- `placement` (дефолт `bottom`), `offset` (дефолт 4)
- `dataTestId`, `className`
- внутри всегда RAC `Dialog`

## Пример

```tsx
<Popover>
    <Popover.Trigger>
        <Button>Фильтры</Button>
    </Popover.Trigger>
    <Popover.Content arrow>
        <p>Выберите статус</p>
        <Button>Применить</Button>
    </Popover.Content>
</Popover>
```

## Не делать

- не ставить наш `Button` без `Popover.Trigger`
- не использовать вместо Select / Modal
- не копировать стили Popover в АП
