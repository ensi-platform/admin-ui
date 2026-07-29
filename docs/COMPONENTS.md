# Components status

Примерный бэклог `admin-ui-*`. Стадии и «База» обновляем по ходу.

## Стадии

| Стадия    | Значение       |
| --------- | -------------- |
| `planned` | в бэклоге      |
| `wip`     | в работе       |
| `partial` | есть, неполный |
| `ready`   | готов          |

## Апрув

| Значение | Смысл                                      |
| -------- | ------------------------------------------ |
| `yes`    | компонент принят (API / стили / поведение) |
| `no`     | ещё не принят                              |

## База

| Значение                     | Смысл                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| `custom`                     | сами (стили + поведение)                                            |
| `lib: react-aria-components` | behavior из React Aria; стили всегда наши (CSS Modules + `--aui-*`) |
| `lib: …`                     | другая behavior/утилита; стили всегда наши                          |
| `TBD`                        | ещё не решили                                                       |

Headless по умолчанию — [`react-aria-components`](https://react-aria.adobe.com). Не shadcn (Tailwind-рецепты). Публичный API наш (`size` / `variant` / `dataTestId`); React Aria — внутри.

`FormControl` не заводим: роль закрывает `Field` / `TextField` (React Aria).

`Form` (RHF + zod) — state/submit/validation в `admin-ui`. FormX (`FormInput` / …) — рядом с контролом, не FormFieldWrapper.

## Карточки

Перед реализацией — карточка по шаблону [`components/_TEMPLATE.md`](./components/_TEMPLATE.md).

Путь: `docs/components/<name>.md` (копия шаблона при старте работы). Массово не плодим.

---

## `admin-ui`

| Компонент             | Стадия    | База                                                                       | Апрув |
| --------------------- | --------- | -------------------------------------------------------------------------- | ----- |
| tokens                | `partial` | `custom`                                                                   | `no`  |
| Button                | `ready`   | `custom`                                                                   | `yes` |
| Typography            | `partial` | `custom`                                                                   | `no`  |
| Form                  | `ready`   | `lib: react-hook-form` + zod                                               | `yes` |
| Field                 | `ready`   | `custom` + RAC `Label` / `Text`                                            | `no`  |
| Input                 | `ready`   | `lib: react-aria-components` (+ `FormInput`)                               | `no`  |
| NumberInput           | `ready`   | `lib: react-aria-components` (`NumberField` + transform / FormNumberInput) | `no`  |
| Textarea              | `ready`   | `lib: react-aria-components` (`TextArea` + FormTextArea)                   | `no`  |
| Checkbox              | `ready`   | `lib: react-aria-components` (`CheckboxField` + `CheckboxButton` + FormCheckbox) | `no`  |
| CheckboxGroup         | `ready`   | `lib: react-aria-components` (`CheckboxGroup` + FormCheckboxGroup)         | `no`  |
| Radio                 | `planned` | `lib: react-aria-components`                                               | `no`  |
| Switch                | `ready`   | `lib: react-aria-components` (`SwitchField` + `SwitchButton` + FormSwitch) | `no`  |
| Select                | `ready`   | `lib: react-aria-components` (+ `FormSelect`)                              | `no`  |
| MultiSelect           | `ready`   | `lib: react-aria-components` (`Select` multiple + FormMultiSelect)         | `no`  |
| Icons (interim)       | `partial` | `custom` (`src/icons`)                                                     | `no`  |
| Autocomplete          | `planned` | `lib: react-aria-components` (`ComboBox`)                                  | `no`  |
| Badge                 | `ready`   | `custom`                                                                   | `no`  |
| Tag                   | `ready`   | `custom`                                                                   | `no`  |
| Tabs                  | `planned` | `lib: react-aria-components`                                               | `no`  |
| Tooltip               | `planned` | `lib: react-aria-components`                                               | `no`  |
| Popover               | `planned` | `lib: react-aria-components`                                               | `no`  |
| Modal                 | `planned` | `lib: react-aria-components` (`Dialog`)                                    | `no`  |
| Drawer                | `planned` | `TBD` (Dialog / custom)                                                    | `no`  |
| DatePicker            | `ready`   | `lib: react-aria-components` (+ vertical calendar / FormDatePicker)        | `no`  |
| DateRangePicker       | `ready`   | `lib: react-aria-components` (+ shared calendar / FormDateRangePicker)     | `no`  |
| TimeField             | `ready`   | `lib: react-aria-components` (+ FormTimeField)                             | `no`  |
| Calendar (internal)   | `ready`   | `custom` month grids + fake scroll (Kontur UX); RAC DatePicker state — not exported | `no`  |
| ColorPicker           | `planned` | `lib: react-aria-components`                                               | `no`  |
| Pagination            | `planned` | `custom`                                                                   | `no`  |
| Breadcrumbs           | `planned` | `custom`                                                                   | `no`  |
| Loader / Skeleton     | `planned` | `custom` (`ProgressBar` — optional RAC)                                    | `no`  |
| Dropzone              | `planned` | `lib: react-aria-components`                                               | `no`  |
| Avatar                | `planned` | `lib: react-aria-components`                                               | `no`  |
| Accordion             | `planned` | `lib: react-aria-components` (`DisclosureGroup`)                           | `no`  |

## `admin-ui-layout` (later)

| Компонент       | Стадия    | База                      | Апрув |
| --------------- | --------- | ------------------------- | ----- |
| Sidebar         | `planned` | `custom`                  | `no`  |
| Header          | `planned` | `custom`                  | `no`  |
| PageHeader      | `planned` | `custom`                  | `no`  |
| Section / Block | `planned` | `custom`                  | `no`  |
| FilterBar       | `planned` | `custom` (сборка из base) | `no`  |

## `admin-ui-kit` / deps (later)

| Сущность        | Стадия    | База     | Апрув |
| --------------- | --------- | -------- | ----- |
| Table           | `planned` | `TBD`    | `no`  |
| admin-ui-icons  | `planned` | `custom` | `no`  |
| admin-ui-tokens | `planned` | `custom` | `no`  |
