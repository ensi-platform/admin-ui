Grid for fields and for column splits.

```tsx
import { GridLayout } from '@ensi-platform/admin-ui/grid-layout';
```

## When to use

- section fields in two or three columns
- one item across the whole grid (`col="full"`)
- a content-and-side split, by passing custom tracks in `cols`
- list filter fields inside `Filters.Body`

## API (short)

| Prop         | Values                                         | Default   | Description                      |
| ------------ | ---------------------------------------------- | --------- | -------------------------------- |
| `cols`       | `number` \| track list                         | —         | columns                          |
| `gap`        | `0` \| `4` \| `8` \| `12` \| `16` \| … \| `64` | `16`      | gap, a spacing-scale step        |
| `col`        | `number` \| `full`                             | —         | span when nested in another grid |
| `align`      | `start` \| `center` \| `end` \| `stretch`      | `stretch` | cross-axis alignment             |
| `hidden`     | `boolean`                                      | `false`   | removes the grid from layout     |
| `dataTestId` | `string`                                       | —         | `data-test-id` for tests         |

`GridLayout.Item` `col` is how many columns to take. `full` crosses the grid. A number in `cols` makes equal `minmax(0, 1fr)` columns. A number inside a track list is `Nfr`; a string is used as written (`minmax(0, 1fr)`).
