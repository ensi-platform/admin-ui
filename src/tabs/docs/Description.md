# Tabs

Underline-табы с sliding indicator. Импорт: `import { Tabs } from '@ensi-platform/admin-ui'`.

## Когда использовать

- секции страницы / карточки сущности
- переключение связанных панелей контента
- не для сегментированного выбора внутри формы — там позже отдельный variant

## API (кратко)

Chrome:

- `size`: sm | md | lg
- `variant`: primary
- `value` / `defaultValue` / `onChange`
- `disabled` — на корне (все табы) или на `Tabs.Tab`
- `dataTestId`, `className`

Compound: `Tabs.List`, `Tabs.Tab` (`id`), `Tabs.Panel` (`id`).

## Пример

```tsx
<Tabs defaultValue="general" size="md">
    <Tabs.List>
        <Tabs.Tab id="general">Общее</Tabs.Tab>
        <Tabs.Tab id="items">Товары</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel id="general">…</Tabs.Panel>
    <Tabs.Panel id="items">…</Tabs.Panel>
</Tabs>
```

## Не делать

- не копировать стили Tabs в АП
- не дублировать примитив обёрткой без нужды
- не красить active underline в brand-blue — indicator = charcoal brand
