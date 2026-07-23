import { FieldError } from './components/Error/index.js';
import { FieldHint } from './components/Hint/index.js';
import { FieldLabel } from './components/Label/index.js';
import { FieldRoot } from './components/Root/index.js';

export const Field = Object.assign(FieldRoot, {
    Label: FieldLabel,
    Hint: FieldHint,
    Error: FieldError,
});
