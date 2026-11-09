A palette: saturation area, hue slider, and preset swatches. The hex field is `ColorField`.

```tsx
import { ColorPicker } from '@ensi-platform/admin-ui/color-picker';
```

## When to use

- the color is chosen on the area, without a code field
- a short set of allowed colors sits next to the area — the `presets` prop
- the code must be typed or shown next to a swatch — see `ColorField`

## API (short)

| Prop                 | Values     | Default | Description                                                                                     |
| -------------------- | ---------- | ------- | ----------------------------------------------------------------------------------------------- |
| `value` / `onChange` | `string`   | —       | `#rrggbb`. An empty string shows a gray draft and is not published until the palette is touched |
| `defaultValue`       | `string`   | `''`    | initial value without external state                                                            |
| `onPreview`          | `function` | —       | live `#rrggbb` while the pointer is down. This is not a commit                                  |
| `presets`            | `string[]` | —       | preset swatches. Strings that are not colors are dropped                                        |
| `hue`                | `number`   | —       | hue of a gray color, in degrees. The field keeps it across opens                                |
| `onHueChange`        | `function` | —       | next hue after a palette move. Pair of `hue`                                                    |
| `disabled`           | `boolean`  | `false` | disabled                                                                                        |
| `dataTestId`         | `string`   | —       | `data-test-id` attribute                                                                        |

A drag publishes when the pointer is released. Arrow keys on the hue slider publish on each step. The first hue move on an empty value publishes gray `#808080`.
