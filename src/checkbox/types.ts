import { type ReactNode, type Ref } from 'react';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';

export type TCheckboxSize = 'sm' | 'md' | 'lg';

export interface ICheckboxProps {
    /** Размер. */
    size?: TCheckboxSize;
    /** Controlled checked (соло). Внутри CheckboxGroup не передавать. */
    checked?: boolean;
    /** Uncontrolled initial checked (соло). */
    defaultChecked?: boolean;
    /** Change (соло). Внутри CheckboxGroup не передавать. */
    onChange?: (checked: boolean) => void;
    /** Indeterminate (полоска вместо галочки). */
    indeterminate?: boolean;
    /** Значение опции внутри RAC CheckboxGroup. */
    value?: string;
    /** Видимый лейбл. Без children нужен `aria-label` / `aria-labelledby`. */
    children?: ReactNode;
    /** Невалидное состояние. */
    isInvalid?: boolean;
    /** Disabled. */
    disabled?: boolean;
    /** Дополнительный className. */
    className?: string;
    /** Значение атрибута `data-test-id`. */
    dataTestId?: string;
    /** Ref на root label (React 19 prop). */
    ref?: Ref<HTMLLabelElement>;
    id?: string;
    name?: string;
    onBlur?: () => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
}

export interface IFormCheckboxProps
    extends
        IFormFieldComponent,
        Omit<
            ICheckboxProps,
            | 'checked'
            | 'defaultChecked'
            | 'onChange'
            | 'onBlur'
            | 'name'
            | 'disabled'
            | 'isInvalid'
            | 'size'
            | 'className'
            | 'dataTestId'
            | 'value'
        > {
    /** Подсказка (`Field.Hint`). */
    hint?: ReactNode;
    /** Размер Field + Checkbox. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
}
