A row or a column with a gap: a title and actions, or several blocks stacked.

```tsx
import { FlexLayout } from '@ensi-platform/admin-ui/flex-layout';
```

## When to use

- a page title and its buttons on one line
- several buttons side by side
- a stack of blocks when equal columns are not needed

Equal field columns use `GridLayout`.

## API (short)

| Prop         | Values                                        | Default   | Description                    |
| ------------ | --------------------------------------------- | --------- | ------------------------------ |
| `direction`  | `row` \| `column`                             | `row`     | axis                           |
| `gap`        | `0` \| `4` \| `8` \| `12` \| `16` \| … \| `64` | `16`      | gap, a spacing-scale step      |
| `align`      | `start` \| `center` \| `end` \| `stretch`     | `stretch` | cross-axis alignment           |
| `justify`    | `start` \| `center` \| `end` \| `between`     | `start`   | main-axis distribution         |
| `wrap`       | `boolean`                                     | `false`   | wrap onto the next line        |
| `hidden`     | `boolean`                                     | `false`   | removes the row from layout    |
| `dataTestId` | `string`                                      | —         | `data-test-id` for tests       |

`FlexLayout.Item` `grow` takes the free space on the main axis.
