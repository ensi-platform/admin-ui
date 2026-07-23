# Components status

Примерный бэклог `admin-ui-*`. Стадии и «База» обновляем по ходу.

## Стадии

| Стадия    | Значение       |
| --------- | -------------- |
| `planned` | в бэклоге      |
| `wip`     | в работе       |
| `partial` | есть, неполный |
| `ready`   | готов          |

## База

| Значение                     | Смысл                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| `custom`                     | сами (стили + поведение)                                            |
| `lib: react-aria-components` | behavior из React Aria; стили всегда наши (CSS Modules + `--aui-*`) |
| `lib: …`                     | другая behavior/утилита; стили всегда наши                          |
| `TBD`                        | ещё не решили                                                       |

Headless по умолчанию — [`react-aria-components`](https://react-aria.adobe.com). Не shadcn (Tailwind-рецепты). Публичный API наш (`size` / `variant` / `dataTestId`); React Aria — внутри.

`FormControl` не заводим: роль закрывает `Field` / `TextField` (React Aria).

`Form` (RHF + zod) — state/submit/validation в `admin-ui-base`. FormX (`FormInput` / …) — рядом с контролом, не FormFieldWrapper.

## Карточки

Перед реализацией — карточка по шаблону [`components/_TEMPLATE.md`](./components/_TEMPLATE.md).

Путь: `docs/components/<name>.md` (копия шаблона при старте работы). Массово не плодим.

---

## `admin-ui-base`

| Компонент             | Стадия    | База                                                                       |
| --------------------- | --------- | -------------------------------------------------------------------------- |
| tokens                | `partial` | `custom`                                                                   |
| Button                | `ready`   | `custom`                                                                   |
| Typography            | `partial` | `custom`                                                                   |
| Form                  | `ready`   | `lib: react-hook-form` + zod                                               |
| Field                 | `ready`   | `custom` + RAC `Label` / `Text`                                            |
| Input                 | `ready`   | `lib: react-aria-components` (+ `FormInput`)                               |
| NumberInput           | `ready`   | `lib: react-aria-components` (`NumberField` + transform / FormNumberInput) |
| Textarea              | `ready`   | `lib: react-aria-components` (`TextArea` + FormTextArea)               |
| Checkbox              | `ready`   | `lib: react-aria-components` (`Checkbox` + FormCheckbox)                   |
| CheckboxGroup         | `ready`   | `lib: react-aria-components` (`CheckboxGroup` + FormCheckboxGroup)         |
| Radio                 | `planned` | `lib: react-aria-components`                                               |
| Switch                | `ready`   | `lib: react-aria-components` (`Switch` + FormSwitch)                       |
| Select                | `ready`   | `lib: react-aria-components` (+ `FormSelect`)                              |
| MultiSelect           | `ready`   | `lib: react-aria-components` (`Select` multiple + FormMultiSelect)         |
| Icons (interim)       | `partial` | `custom` (`src/icons`)                                                     |
| Autocomplete          | `planned` | `lib: react-aria-components` (`ComboBox`)                                  |
| Badge                 | `ready`   | `custom`                                                                   |
| Tag                   | `ready`   | `custom`                                                                   |
| Tabs                  | `planned` | `lib: react-aria-components`                                               |
| Tooltip               | `planned` | `lib: react-aria-components`                                               |
| Popover               | `planned` | `lib: react-aria-components`                                               |
| Modal                 | `planned` | `lib: react-aria-components` (`Dialog`)                                    |
| Drawer                | `planned` | `TBD` (Dialog / custom)                                                    |
| Calendar / DatePicker | `planned` | `lib: react-aria-components`                                               |
| ColorPicker           | `planned` | `lib: react-aria-components`                                               |
| Pagination            | `planned` | `custom`                                                                   |
| Breadcrumbs           | `planned` | `custom`                                                                   |
| Loader / Skeleton     | `planned` | `custom` (`ProgressBar` — optional RAC)                                    |
| Dropzone              | `planned` | `lib: react-aria-components`                                               |
| Avatar                | `planned` | `lib: react-aria-components`                                               |
| Accordion             | `planned` | `lib: react-aria-components` (`DisclosureGroup`)                           |

## `admin-ui-layout` (later)

| Компонент       | Стадия    | База                      |
| --------------- | --------- | ------------------------- |
| Sidebar         | `planned` | `custom`                  |
| Header          | `planned` | `custom`                  |
| PageHeader      | `planned` | `custom`                  |
| Section / Block | `planned` | `custom`                  |
| FilterBar       | `planned` | `custom` (сборка из base) |

## `admin-ui-kit` / deps (later)

| Сущность        | Стадия    | База     |
| --------------- | --------- | -------- |
| Table           | `planned` | `TBD`    |
| admin-ui-icons  | `planned` | `custom` |
| admin-ui-tokens | `planned` | `custom` |
