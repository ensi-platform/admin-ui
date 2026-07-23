import { type ReactNode, type Ref } from 'react';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';

export type TCheckboxGroupSize = 'sm' | 'md' | 'lg';

export interface ICheckboxGroupProps {
    /** Controlled selection. */
    value?: string[];
    /** Uncontrolled initial selection. */
    defaultValue?: string[];
    /** Selection change. */
    onChange?: (value: string[]) => void;
    /** Checkbox’и и произвольная вёрстка. */
    children: ReactNode;
    /** Размер chrome (`data-size`); size Checkbox задаётся явно на items. */
    size?: TCheckboxGroupSize;
    /** Невалидное состояние. */
    isInvalid?: boolean;
    /** Disabled всей группы. */
    disabled?: boolean;
    /** className корня. */
    className?: string;
    /** `data-test-id` корня. */
    dataTestId?: string;
    /** Ref на корень group (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    id?: string;
    name?: string;
    onBlur?: () => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

export interface IFormCheckboxGroupProps
    extends
        IFormFieldComponent,
        Omit<
            ICheckboxGroupProps,
            | 'value'
            | 'defaultValue'
            | 'onChange'
            | 'onBlur'
            | 'name'
            | 'disabled'
            | 'isInvalid'
            | 'size'
            | 'className'
            | 'dataTestId'
            | 'children'
        > {
    /** Подпись группы (`Field.Label`). */
    label?: ReactNode;
    /** Подсказка (`Field.Hint`). */
    hint?: ReactNode;
    /** Checkbox’и / layout-wrapper’ы. */
    children: ReactNode;
    /** Размер Field + Group chrome. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
}
