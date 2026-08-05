Circular user mark with initials or photo.

```tsx
import { Avatar } from '@ensi-platform/admin-ui/avatar';
```

## When to use

- avatar in sidebar, header, or lists
- initials from `name` / `initials`, or photo via `src`
- not for status labels — see `Badge`

## API (short)

| Prop         | Values               | Default     | Description                                 |
| ------------ | -------------------- | ----------- | ------------------------------------------- |
| `size`       | `sm` \| `md` \| `lg` | `md`        | size                                        |
| `variant`    | `primary`            | `primary`   | visual variant                              |
| `name`       | `string`             | —           | name (a11y + initials source)               |
| `initials`   | `string`             | from `name` | explicit initials                           |
| `src`        | `string`             | —           | image URL                                   |
| `children`   | `ReactNode`          | —           | custom content (overrides `src` / initials) |
| `dataTestId` | `string`             | —           | `data-test-id`                              |
