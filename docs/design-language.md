# Design language (admin UI)

Визуальный канон экранов АП Ensi. Токены `--aui-*` — в Storybook Design System / Tokens; здесь — **слои, сайдбар, сборка экранов**.

## Формула

Подложка (bg) и обводка (border) по отдельности — ок.  
Когда их много **и** вместе **и** во вложенных коробках — мусор.

| Правило | |
| --- | --- |
| Контейнер зоны | **XOR**: либо `surface-bg-*`, либо `surface-border-*`, не оба |
| Бюджет вложенности | ≤ **2** surface-коробки от `page` до deepest leaf |
| Chip / Tag / Badge | один сигнал: tint **или** outline, не оба |
| Разделение зон | gap / divider / контраст bg — не новая card |

**Исключения** (bg + border допустимы):

- интерактивный control (`Input`, `Select`, …)
- focus ring
- semantic alert (danger/warning box)

Эталон слоёв: Контур.Диадок (есть подложки и обводки, нет стопки рамок).  
Антиэталон: Эльба / старые nested boxes (muted bar → bordered controls внутри → ещё card снаружи).

## App chrome / CascadeMenu

Готовая колонка: `@ensi-platform/admin-ui/cascade-menu` (`CascadeMenu`).  
Части: `MenuList` (`@ensi-platform/admin-ui/menu-list`), `Avatar` (`@ensi-platform/admin-ui/avatar`), лого `LogoEnsiMark` + текст `ensi-opensource`.

**Source of truth chrome:** Storybook `App/CascadeMenu` + эта секция (WIP).

| | Да | Нет |
| --- | --- | --- |
| Навигация | hover-flyout у стрелки (aim-delay); L0 в layout | flat dissolve; accordion; кнопка Back |
| Лого | `LogoEnsiMark` + текст `ensi-opensource`, `currentColor`; опциональный `title` под brand; collapse → Mark only | полный `LogoEnsi` wordmark в opensource chrome; жёсткий `#000` / `#fff` в SVG; collapse только в футере |
| Колонка L0 | light: `neutral-50` `#fafafa` (страница белая); dark: `--aui-black-900`; hover `--aui-surface-bg-muted` / `--aui-grey-700`; fg = page; resize; collapse → icon-rail; в rail folder hover → flyout, leaf → Tooltip | колонка другого hue; collapse отключает flyout |
| Flyout | full-height = высота L0; flush left; тот же bg что L0; border-right divider; без тени/radius; работает и из collapsed rail | floating card от пункта; push layout; surface / light panel |
| Active | `data-open` только у открытого flyout-folder; current leaf без pill (крошки) | persistent path pill от `activePath`; leaf soft pill; pill **и** left bar **и** border |
| Pins | один пункт Pinned в L0 → hover-flyout со списком; hint про ПКМ если пусто; RMB Pin/Unpin (не L0) + Open in new tab; leaf+folder; divider; лимит 8; LS по `pinUserId` | список N пинов прямо в L0; pin L0; trailing pin button; card вокруг пинов; DnD; sticky flyout |
| User | divider + `Avatar` → `Popover` | user в bordered card |
| Поиск | кнопка рядом со сворачиванием; затемнение + небольшое окно выше центра (поле и список листов `link` + путь); Escape / клик по затемнению закрывает; полоска не разворачивается | фильтр дерева на месте; счётчики |

CascadeMenu = слой 0 (app chrome). **Не** входит в content-budget таблицы/форм.

Layout `sidebar | page` — у consumer (flyout поверх page).  
Z-order: L0+flyout (`--aui-z-chrome`) выше sticky table (`--aui-table-z-sticky`), ниже dropdown/modal (`--aui-z-dropdown` / `--aui-z-modal`).

## Экраны (сборка из базы)

Примитивы: `CascadeMenu` / `MenuList`, `Button`, `Tag`, `Badge`, `Table`, `Tabs`, `VerticalTabs`, `Field` + controls, при необходимости `Drawer`.

### List — таблица

- title (`headingM`); `Button` secondary «Фильтры» + primary «+ Новый …»
- активные фильтры: `ActiveFilters` (`Tag` + ссылка «Очистить») — **без** bordered bar вокруг ряда
- `Table` flush на `page` — **без** внешней rounded card
- статус в ячейке — `Badge` (tint only)
- pagination: active = fill; **без** border-клетки на каждую страницу
- не использовать segmented «Таблица \| Фильтры» (две outlined-кнопки)

### List — фильтры

- те же title / primary action
- сетка `Field` + Select / DateRange / … на `page`
- **без** card-обёртки и **без** muted-bar вокруг контролов
- длинная форма — `Drawer`, не ещё одна вложенная коробка на page
- без pill-tabs как фильтров типа документа

### Detail

- back-link; title + `Badge`; `⋯` + primary «Сохранить»
- разделы страницы — underline `Tabs` (не pill-ряд с обводкой)
- секции внутри одной вкладки — `VerticalTabs` (колонка слева, панель справа)
- секции: H2 + gap; поля на `page` в `Grid` — **без** card на каждую секцию
- один alert (bg+border) — единственный тяжёлый вложенный блок
- теги в поле — tint без второй обводки поверх `Field`

## Тема (из `src/ds/tokens`)

Light / dark — один контракт, remap (`data-theme`). Не отдельный look в dark. Шрифт: Inter. Page title списка/detail — `typographyStyles.headingM`. Space/radius/control-h — rem (root 16px на `AdminUiProvider`).

| Роль | Light | Dark |
| --- | --- | --- |
| page bg | `#ffffff` | `#1b1d22` (`black-900`) |
| page fg | `#0a0a0a` (`neutral-900`) | `#f1f5f9` (`grey-100`) |
| fg muted | `#737373` (`neutral-500`) | `#8b929e` (`grey-400`) |
| link | = page fg (underline); hover `neutral-800` | = page fg; hover white |
| sidebar | `#fafafa` (`neutral-50`) | = page |
| surface muted (secondary btn / tag) | `#f5f5f5` (`neutral-100`) | `#3f4651` (`grey-600`) |
| surface primary (input fill) | `#ffffff` | `#212328` (`black-800`) |
| table fill | = page (flush) | = page (flush) |
| surface border | `#e5e5e5` (`neutral-200`) | `#3f4651` (`grey-600`) |
| primary button | bg `#171717` (`neutral-800`), fg `#fafafa` | bg `#f1f5f9`, fg `#1b1d22` |
| focus | `#a1a1a1` (`neutral-400`) | grey-100 |
| badge success/warning/danger | soft `*-50` bg + `*-700` fg | `color-mix(*-500 22%, surface)` + `*-500` fg |
| badge info | = neutral | = neutral |
| control radius | `8px` (`radius-8`) | same |

Light accent = neutral (`neutral-800` / `#171717`). Dark accent = light grey fill. Status = red/green/yellow only (info = neutral).

## Связанное

- consumer skill: [`skills/`](./skills/) — выбор примитивов; визуальный канон экранов — этот файл
