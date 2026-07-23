import { type ReactNode, type Ref } from 'react';

import { type InputProps as RacInputProps } from 'react-aria-components';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';

export type TInputSize = 'sm' | 'md' | 'lg';

export interface IInputProps extends Omit<RacInputProps, 'className' | 'disabled' | 'size'> {
    /** Размер контрола. Внутри Field наследует `Field.size`, если не задан. */
    size?: TInputSize;
    /** Невалидное состояние (бордер + aria-invalid). Внутри Field наследует `Field.isInvalid`. */
    isInvalid?: boolean;
    /** Disabled. Внутри Field наследует `Field.disabled`. */
    disabled?: boolean;
    /** Дополнительный className. */
    className?: string;
    /** Значение атрибута `data-test-id`. */
    dataTestId?: string;
    /** Ref на native input (React 19 prop). */
    ref?: Ref<HTMLInputElement>;
}

export interface IFormInputProps
    extends
        IFormFieldComponent,
        Omit<
            IInputProps,
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
        > {
    /** Подпись поля (`Field.Label`). */
    label?: ReactNode;
    /** Подсказка (`Field.Hint`). */
    hint?: ReactNode;
    /** Размер Field + Input. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
}
