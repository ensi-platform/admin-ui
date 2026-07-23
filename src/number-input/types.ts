import { type FocusEventHandler, type ReactNode, type Ref } from 'react';

import { type NumberFieldProps as RacNumberFieldProps } from 'react-aria-components';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';
import { type TInputSize } from '../input/types.js';

export interface INumberTransform<TStore = number> {
    format: (store: TStore | null | undefined) => number | null;
    parse: (view: number | null) => TStore | null;
}

type TRacNumberFieldBase = Omit<
    RacNumberFieldProps,
    | 'children'
    | 'className'
    | 'isDisabled'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'minValue'
    | 'maxValue'
    | 'placeholder'
    | 'name'
    | 'id'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
>;

export interface INumberInputProps extends TRacNumberFieldBase {
    /** Размер контрола. */
    size?: TInputSize;
    /** Disabled. */
    disabled?: boolean;
    /** Контролируемое значение (view). `null` — пусто. */
    value?: number | null;
    /** Неконтролируемое начальное значение. */
    defaultValue?: number | null;
    /** Изменение view-значения. */
    onChange?: (value: number | null) => void;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /** Минимум (view). */
    min?: number;
    /** Максимум (view). */
    max?: number;
    /** Шаг (view). */
    step?: number;
    /** Контент слева от поля. */
    prefix?: ReactNode;
    /** Контент справа (₽, кг, …). */
    suffix?: ReactNode;
    /** Placeholder. */
    placeholder?: string;
    /** name нативного input. */
    name?: string;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    /** className корневого NumberField. */
    className?: string;
    /** `data-test-id` на Group. */
    dataTestId?: string;
    /** Ref на native input внутри NumberField (React 19 prop). */
    ref?: Ref<HTMLInputElement>;
}

export interface IFormNumberInputProps
    extends
        IFormFieldComponent,
        Omit<
            INumberInputProps,
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
            | 'id'
        > {
    /** Подпись (`Field.Label`). */
    label?: ReactNode;
    /** Подсказка (`Field.Hint`). */
    hint?: ReactNode;
    /** Размер Field + NumberInput. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
    /** store ↔ view. Без transform store = `number | null`. */
    transform?: INumberTransform;
}
