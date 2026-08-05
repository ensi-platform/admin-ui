## Example

```tsx
<Link href="/orders" typography="bodyM" dataTestId="orders-link">
    To orders
</Link>
```

App router wrap (ideal case) — see **Getting started**:

```tsx
import { Link as AuiLink, type TLinkProps } from '@ensi-platform/admin-ui/link';
import { Link as RouterLink } from 'react-router';

export const Link = (props: Omit<TLinkProps<typeof RouterLink>, 'as'>) => <AuiLink as={RouterLink} {...props} />;
```
