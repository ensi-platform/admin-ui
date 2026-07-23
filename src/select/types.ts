import { type ReactNode, type Ref } from 'react';

import { type SelectProps as RacSelectProps } from 'react-aria-components';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';

export type TSelectSize = 'sm' | 'md' | 'lg';

export type TSelectValue = string | number;

export interface ISelectOption {
    /** Значение option (Key для RAC). */
    value: TSelectValue;
    /** Подпись в списке и в trigger. */
    label: string;
    /** Disabled option. */
    disabled?: boolean;
}

type TRacSelectBase = Omit<
    RacSelectProps<object, 'single'>,
    | 'children'
    | 'className'
    | 'isDisabled'
    | 'selectedKey'
    | 'defaultSelectedKey'
    | 'onSelectionChange'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'selectionMode'
>;

export interface ISelectProps extends TRacSelectBase {
    /** Список опций. */
    options: ISelectOption[];
    /** Controlled value. `null` — пусто (после clear). */
    value?: TSelectValue | null;
    /** Uncontrolled initial value. */
    defaultValue?: TSelectValue | null;
    /** Выбор / clear (`null`). */
    onChange?: (value: TSelectValue | null) => void;
    /** Кнопка очистки выбранного значения. */
    clear?: boolean;
    /** Размер trigger. */
    size?: TSelectSize;
    /** Disabled. */
    disabled?: boolean;
    /** className корня RAC Select. */
    className?: string;
    /** `data-test-id` корня. */
    dataTestId?: string;
    /** Ref на корень RAC Select (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFormSelectProps
    extends
        IFormFieldComponent,
        Omit<
            ISelectProps,
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
    /** Размер Field + Select. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
}
