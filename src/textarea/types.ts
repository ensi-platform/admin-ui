import { type ReactNode, type Ref } from 'react';

import { type TextAreaProps as RacTextAreaProps } from 'react-aria-components';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';

export type TTextAreaSize = 'sm' | 'md' | 'lg';

export interface ITextAreaProps extends Omit<RacTextAreaProps, 'className' | 'disabled'> {
    /** Размер контрола. Внутри Field наследует `Field.size`, если не задан. */
    size?: TTextAreaSize;
    /** Невалидное состояние (бордер + aria-invalid). Внутри Field наследует `Field.isInvalid`. */
    isInvalid?: boolean;
    /** Disabled. Внутри Field наследует `Field.disabled`. */
    disabled?: boolean;
    /** Дополнительный className. */
    className?: string;
    /** Значение атрибута `data-test-id`. */
    dataTestId?: string;
    /** Ref на native textarea (React 19 prop). */
    ref?: Ref<HTMLTextAreaElement>;
}

export interface IFormTextAreaProps
    extends
        IFormFieldComponent,
        Omit<
            ITextAreaProps,
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
    /** Размер Field + TextArea. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
}
