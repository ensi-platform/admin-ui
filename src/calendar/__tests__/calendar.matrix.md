# Calendar

Public selection lives on `DatePicker`, which renders this calendar.

| Scenario | Proof |
| --- | --- |
| Open, select a day, arrows, Enter, unavailable day | `src/date-picker/__tests__/date-picker.test.tsx` |
| Min / max year | `it('respects props maxValue over default year max')` in DatePicker |
| Day-step math (arrows, Home/End, PageUp, skip unavailable) | `src/calendar/__tests__/use-calendar-grid-keyboard.test.ts` |
| Sticky headers, fake scroll offsets, drag | needs browser — jsdom has no layout |
| Hook tests that only repeat the DatePicker scenario | kept until that scenario is the only proof; not deleted in this pass |
