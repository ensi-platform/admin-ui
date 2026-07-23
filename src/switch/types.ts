import { type ReactNode, type Ref } from 'react';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';

export type TSwitchSize = 'sm' | 'md' | 'lg';

export interface ISwitchProps {
    /** Размер. */
    size?: TSwitchSize;
    /** Controlled checked. */
    checked?: boolean;
    /** Uncontrolled initial checked. */
    defaultChecked?: boolean;
    /** Change handler. */
    onChange?: (checked: boolean) => void;
    /** Видимый лейбл. Без children нужен `aria-label` / `aria-labelledby`. */
    children?: ReactNode;
    /** Невалидное состояние (визуал + aria-invalid). */
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

export interface IFormSwitchProps
    extends
        IFormFieldComponent,
        Omit<
            ISwitchProps,
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
        > {
    /** Подсказка (`Field.Hint`). */
    hint?: ReactNode;
    /** Размер Field + Switch. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
}
