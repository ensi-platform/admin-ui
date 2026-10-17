# AdminUiProvider

| Scenario | Proof |
| --- | --- |
| Every built-in label is rendered and can be overridden | `it('shows built-in %s and replaces it with an override')` |
| One override keeps the other built-in strings | `it('overrides one label and keeps the other built-in strings')` |
| Locale and direction | `it('exposes the given locale')`, `it('defaults locale to ru-RU and text direction to ltr')`, `it('uses the locale text direction when direction is omitted')`, `it('lets direction override the locale')` |
| Root element, className, ref, `as` | `it('renders a div root by default')`, `it('renders the root as the given element')`, `it('merges className onto the root')`, `it('forwards object ref to the root')` |
| `document.body` root | `it('uses document.body as the root')` |
| `linkComponent` | `it('renders the host link component')`, `it('defaults the host link to an anchor')` |
| Missing provider throws | `it('throws when labels is read outside the provider')` and the locale, direction, and link cases |
| Consumer-specific label formatting (`{page}`, `{value}`) | proved in the component that formats the string (Table, CopyButton) |
| axe | n/a — provider is a landmark-free wrapper; components assert axe |
