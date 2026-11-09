File field: click, drag, and paste.

```tsx
import { Dropzone, FormDropzone } from '@ensi-platform/admin-ui/dropzone';
```

## When to use

- attachments on an entity (several files, order matters)
- a single image (logo, avatar) — `maxFiles={1}` and an `accept` map whose keys are all `image/`
- a file import — the same primitive with `maxFiles={1}`

## API (short)

The value is `{ id, name, size, type, file?, url? }[]`. A new file gets `id` and `file`. A server file arrives with `id` and `url`. Rejection text is not part of the value. `title` and `description` sit above a large zone with an upload icon, and the files sit under the zone. Accepted types and the per-file limit sit in the zone, and `hint` is appended to that line. `validate` returns a refusal reason or nothing: a reason keeps the file out of the list. Count and total size sit on a line under the zone. At the count limit the zone says the limit is reached and does not take another file. `maxFiles={1}` keeps the zone open: the new file replaces the current one. `onChange` runs before `onRemove` of the file that left. `layout="grid"` renders cards: an image gets a preview, anything else gets a type icon. Retry and remove are buttons on the row. `upload` sends the file immediately; it enters the value after the response, with `id` and `url` and without `file`.

### Dropzone

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | heading above the zone |
| `description` | `ReactNode` | — | text under the heading |
| `hint` | `ReactNode` | — | extra rule on the zone line, after types and the per-file limit |
| `validate` | `(file) => string \| null \| Promise<...>` | — | empty keeps the file, a string is the refusal reason |
| `value` | `IDropzoneFile[]` | — | selected files; without it the list is kept inside |
| `defaultValue` | `IDropzoneFile[]` | — | initial list when `value` is omitted |
| `onChange` | `(files) => void` | — | next list |
| `onRemove` | `(file) => void` | — | after removal; the argument still has `id` |
| `renderAction` | `(file) => ReactNode` | — | extra control next to remove; `Dropzone.Action` is that button, with `icon` and `hidden` |
| `accept` | `Record<mime, string[]>` | — | allowed types |
| `maxSize` | `number` | — | max bytes per file |
| `maxTotalSize` | `number` | — | max bytes for the list plus files still uploading |
| `maxFiles` | `number` | — | count limit; `1` replaces the current file |
| `maxFileNameLength` | `number` | — | max name length |
| `paste` | `boolean` | `false` | paste into the focused zone |
| `loading` | `boolean` | `false` | zone stays and rejects files; skeleton rows replace the list |
| `layout` | `list` \| `grid` | `list` | rows or cards; picks `list` and `item` when those are omitted |
| `list` | `ComponentType<IFileListProps>` | from `layout` | custom file list |
| `item` | `ComponentType<IDropzoneItem>` | from `layout` | file element; the list receives it |
| `upload` | `(file, { onProgress, signal }) => Promise<{ id, url }>` | — | send immediately; `onProgress` moves the bar, `signal` cancels the row |
| `disabled` | `boolean \| { add?, remove?, reorder? }` | `false` | `true` blocks adding, removal, and reorder. An object blocks only keys set to `true`; the remove control stays in place |
| `invalid` | `boolean` | `false` | field error |
| `size` | `sm` \| `md` \| `lg` | `md` | size; inside Field inherits `Field.size` |
| `dataTestId` | `string` | — | `data-test-id` for tests |

A rejected file is not added. Valid files from the same batch are. The reason is a line under the field; the next batch with no rejections clears it. A click adds a row to the selection, and a second click on that row removes only it. Selection exists when there is more than one file and removal is allowed. A mouse drag starts from anywhere on the row except its buttons, and a click selects it. The grip stays for the keyboard and for touch. Dropping highlights the whole row under the pointer, and the file takes that row's place. The size sits under the name. While something is selected, that hint is replaced by a count on the left and icon buttons on the right: select all and delete selected. Select all is hidden when every file is selected. A second click, Escape, or a click outside the list clears the selection; Delete, Backspace, and Escape work only while focus is inside this dropzone. On touch a tap toggles a row.  An in-flight row has Cancel: the row goes away and `onRemove` is not called. Without `onProgress` the bar has no number. A failed upload stays on the row, with the rejection text in place of the size, or the generic caption when that text is empty. It can be retried or discarded.

No `as`.

### FormDropzone

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | label (`Field.Label`) |
| `hint` | `ReactNode` | — | hint |
| `size` | `sm` \| `md` \| `lg` | `md` | size (on Field) |
| `disabled` | `boolean \| { add?, remove?, reorder? }` | — | same as Dropzone; `true` also disables Field |
| `accept` | `Record<mime, string[]>` | — | allowed types |
| `maxSize` | `number` | — | max bytes per file |
| `maxTotalSize` | `number` | — | max bytes for the sum |
| `maxFiles` | `number` | — | count limit; `1` replaces the file |
| `maxFileNameLength` | `number` | — | max name length |
| `paste` | `boolean` | `false` | paste |
| `loading` | `boolean` | `false` | skeleton instead of the list |
| `layout` | `list` \| `grid` | `list` | rows or cards |
| `upload` | `(file, { onProgress, signal }) => Promise<{ id, url }>` | — | send immediately |
| `validate` | `(file) => string \| null \| Promise<...>` | — | empty keeps the file, a string is the refusal reason |
| `onRemove` | `(file) => void` | — | after removal |
| `renderAction` | `(file) => ReactNode` | — | extra control, `Dropzone.Action` |
| `dataTestId` | `string` | — | `data-test-id` for tests |

The schema message and the rejection line share one slot under the field. A file rejection does not set a form error: submit stays available when the schema accepts the files already kept. Submit is blocked while a file is uploading or a failed upload is still in the list.
