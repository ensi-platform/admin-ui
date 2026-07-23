import { type ReactNode, type Ref } from 'react';

import { type SelectProps as RacSelectProps } from 'react-aria-components';

import { type TFieldSize } from '../field/types.js';
import { type IFormFieldComponent } from '../form/types.js';
import { type ISelectOption, type TSelectSize, type TSelectValue } from '../select/types.js';

export type { ISelectOption, TSelectSize, TSelectValue };

type TRacMultiSelectBase = Omit<
    RacSelectProps<object, 'multiple'>,
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

export interface IMultiSelectProps extends TRacMultiSelectBase {
    /** Список опций. */
    options: ISelectOption[];
    /** Controlled value. `[]` — пусто (после clear). */
    value?: TSelectValue[];
    /** Uncontrolled initial value. */
    defaultValue?: TSelectValue[];
    /** Выбор / clear (`[]`). */
    onChange?: (value: TSelectValue[]) => void;
    /** Кнопка очистки всего выбора. */
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

export interface IFormMultiSelectProps
    extends
        IFormFieldComponent,
        Omit<
            IMultiSelectProps,
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
    /** Размер Field + MultiSelect. */
    size?: TFieldSize;
    /** Disabled (OR с Form.disabled). */
    disabled?: boolean;
    /** className корневого Field. */
    className?: string;
    /** `data-test-id` корневого Field. */
    dataTestId?: string;
}
