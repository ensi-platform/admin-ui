# Tooltip

Подсказка на hover/focus. Импорт: `import { Tooltip } from '@ensi-platform/admin-ui'`.

## Когда использовать

- короткая подсказка к иконке / кнопке без текста
- не для интерактивного контента — там `Popover`
- на touch tooltip не показывается — UI должен работать без него

## API (кратко)

### Tooltip

- RAC `TooltipTrigger`: `delay` (дефолт 200), `closeDelay` (дефолт 100), children

### Tooltip.Trigger

- обёртка `Focusable` для нашего `Button` / кастомного триггера

### Tooltip.Content

- `size`: sm | md | lg
- `variant`: primary
- `arrow` — стрелка к триггеру
- `placement`, `offset` (дефолт 4)
- `dataTestId`, `className`

## Пример

```tsx
<Tooltip>
    <Tooltip.Trigger>
        <Button aria-label="Справка">ⓘ</Button>
    </Tooltip.Trigger>
    <Tooltip.Content arrow>Краткая подсказка</Tooltip.Content>
</Tooltip>
```

## Не делать

- не класть кнопки / ссылки внутрь Content
- не ставить наш `Button` без `Tooltip.Trigger`
- не копировать стили Tooltip в АП
