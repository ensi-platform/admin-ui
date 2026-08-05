# Design language (admin UI)

Визуальный канон экранов АП Ensi. Токены и CSS Modules — в `.cursor/rules/tokens.mdc` / `component-styles.mdc`; здесь — **слои, сайдбар, сборка экранов**.

Канон-скрины: [`concepts/`](./concepts/) `*-v3.png`. Предыдущие (`*-v2`, list без суффикса) — архив.

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
Скрины `*-v3.png` — **не** канон IA и визуала сайдбара (меню на макетах устарело); для nav ими не сверяться.

| | Да | Нет |
| --- | --- | --- |
| Навигация | hover-flyout у стрелки (aim-delay); L0 в layout | flat dissolve; accordion; кнопка Back |
| Лого | `LogoEnsiMark` + текст `ensi-opensource`, `currentColor`; опциональный `title` под brand; collapse → Mark only | полный `LogoEnsi` wordmark в opensource chrome; жёсткий `#000` / `#fff` в SVG; collapse только в футере |
| Колонка L0 | light/dark: page family (light `grey-50` `#f8fafc`, dark `--aui-black-900`, hover `--aui-surface-bg-muted` / `--aui-grey-700`); fg = page; resize; collapse → icon-rail; в rail folder hover → flyout, leaf → Tooltip | muted колонка другого hue; charcoal rail в light; сверка с v3-скрином; collapse отключает flyout |
| Flyout | full-height = высота L0; flush left; тот же bg что L0; border-right divider; без тени/radius; работает и из collapsed rail | floating card от пункта; push layout; surface / light panel |
| Active | `data-open` только у открытого flyout-folder; current leaf без pill (крошки) | persistent path pill от `activePath`; leaf soft pill; pill **и** left bar **и** border |
| Pins | один пункт Pinned в L0 → hover-flyout со списком; hint про ПКМ если пусто; RMB Pin/Unpin (не L0) + Open in new tab; leaf+folder; divider; лимит 8; LS по `pinUserId` | список N пинов прямо в L0; pin L0; trailing pin button; card вокруг пинов; DnD; sticky flyout |
| User | divider + `Avatar` → `Popover` | user в bordered card |
| Поиск / счётчики | нет | — |

CascadeMenu = слой 0 (app chrome). **Не** входит в content-budget таблицы/форм.

Layout `sidebar | page` — у consumer (flyout поверх page).  
Z-order: L0+flyout (`--aui-z-chrome`) выше sticky table (`--aui-table-z-sticky`), ниже dropdown/modal (`--aui-z-dropdown` / `--aui-z-modal`).

## Экраны (сборка из базы)

Примитивы: `CascadeMenu` / `MenuList`, `Button`, `Tag`, `Badge`, `Table`, `Tabs`, `Field` + controls, при необходимости `Drawer`.

### List — таблица

- title (`headingM`); `Button` secondary «Фильтры» + primary «+ Новый …»
- активные фильтры: ряд `Tag` + link «Очистить» — **без** bordered bar вокруг ряда
- `Table` flush на `page` — **без** внешней rounded card
- статус в ячейке — `Badge` (tint only)
- pagination: active = fill; **без** border-клетки на каждую страницу
- не использовать segmented «Таблица \| Фильтры» (две outlined-кнопки)

Канон: `ap-concept-list-table-{light\|dark}-v3.png`

### List — фильтры

- те же title / primary action
- сетка `Field` + Select / DateRange / … на `page`
- **без** card-обёртки и **без** muted-bar вокруг контролов
- длинная форма — `Drawer`, не ещё одна вложенная коробка на page
- без pill-tabs как фильтров типа документа

Канон: `ap-concept-list-filters-{light\|dark}-v3.png`

### Detail

- back-link; title + `Badge`; `⋯` + primary «Сохранить»
- разделы страницы — underline `Tabs` (не pill-ряд с обводкой)
- секции: H2 + gap; поля на `page` — **без** card на каждую секцию
- один alert (bg+border) — единственный тяжёлый вложенный блок
- теги в поле — tint без второй обводки поверх `Field`

Канон: `ap-concept-detail-{light\|dark}-v3.png`

## Тема (из `src/ds/tokens`)

Light / dark — один контракт, remap (`data-theme`). Не отдельный look в dark. Шрифт: Inter. Page title списка/detail — `typographyStyles.headingM`. Space/radius/control-h — rem (root 16px на `AdminUiProvider`).

| Роль | Light | Dark |
| --- | --- | --- |
| page bg | `#f8fafc` (`grey-50`) | `#1b1d22` (`black-900`) |
| page fg | `#1b1d22` | `#f1f5f9` (`grey-100`) |
| fg muted | `#8b929e` (`grey-400`) | `#8b929e` (`grey-400`) |
| link | = page fg (underline); hover charcoal | = page fg; hover white |
| surface muted (nav / secondary btn / tag) | `#f1f5f9` (`grey-100`) | `#3f4651` (`grey-600`) |
| surface primary (input fill) | `#ffffff` | `#212328` (`black-800`) |
| table fill | = page (flush) | = page (flush) |
| surface border | `#e2e8f0` (`grey-200`) | `#3f4651` (`grey-600`) |
| primary button | bg `#3d3d3d` (`charcoal-500`), fg white | bg `#f1f5f9`, fg `#1b1d22` |
| focus | charcoal-500 | grey-100 |
| badge success/warning/danger | soft `*-50` bg + `*-700` fg | `color-mix(*-500 22%, surface)` + `*-500` fg |
| badge info | = neutral | = neutral |
| control radius | `8px` (`radius-8`) | same |

Accent chrome = charcoal/brand. Status = red/green/yellow only (info = neutral).

## Связанное

- индекс скринов: [`concepts/README.md`](./concepts/README.md)
- агент в этом репо: skill `align-to-concept`, rule `design-language.mdc`
- consumer skill: [`skills/`](./skills/) — выбор примитивов, не визуальный канон экранов
