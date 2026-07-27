# AdminUiProvider

Корневой провайдер пакета: portal isolation, RTL и словарь встроенных строк. Импорт: `import { AdminUiProvider, useAuiLabels } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- один раз у корня АП / Storybook
- перед portal-компонентами (Modal, Popover, Select)
- чтобы передать `locale` и `labels` из i18n приложения

## API (кратко)

- `direction`: `ltr` | `rtl` (optional) — override; иначе из locale через React Aria `useLocale` + `dir` на корне
- `locale`: string (default `ru-RU`) — `I18nProvider` + `Intl` в примитивах
- `labels`: `Partial<IAuiLabels>` — merge поверх EN-дефолтов (`close`, `clear`, `loadingSuggestions`, `noSuggestions`, `suggestionsError`, `moreSelected`, …)
- `className` — на root-`div` с `isolation: isolate` + base reset (`box-sizing: border-box`, `margin: 0` на потомках)

Хуки (только внутри провайдера):

- `useAuiLabels()` → полный словарь
- `useAuiLocale()` → `string`
- `useAuiDirection()` → `ltr` | `rtl`

## Пример

```tsx
import '@ensi-platform/admin-ui-base/tokens';
import { AdminUiProvider, useAuiLabels } from '@ensi-platform/admin-ui-base';

<AdminUiProvider locale="ru-RU" labels={{ close: t('aui.close'), clear: t('aui.clear') }}>
    <App />
</AdminUiProvider>;

// в примитиве:
const { close } = useAuiLabels();
```

## Не делать

- не хардкодить встроенные a11y-строки в примитивах — только `useAuiLabels()`
- не класть бизнес-копирайт в `labels` — он приходит children/props снаружи
- не ставить `lang` на `<html>` из пакета — это ответственность АП
- не дублировать reset (`margin: 0`, `box-sizing`) в CSS Modules примитивов — это зона Provider
