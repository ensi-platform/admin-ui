import { useContext } from 'react';

import { ComboBoxStateContext, SelectStateContext } from 'react-aria-components';

import { FieldClearButton } from './Component';
import { type TFieldClearSize, type TFieldClearVariant } from './types';

const isEmptyMultiValue = (value: unknown): boolean => {
    if (value == null) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return false;
};

interface IAdapterProps {
    isDisabled: boolean;
    size: TFieldClearSize;
    variant: TFieldClearVariant;
}

/** Clear for single Select (SelectStateContext). */
export const FieldSelectClearButton = ({ isDisabled, size, variant }: IAdapterProps) => {
    const state = useContext(SelectStateContext);

    if (!state || state.selectedKey == null || isDisabled) {
        return null;
    }

    return (
        <FieldClearButton
            isDisabled={isDisabled}
            size={size}
            variant={variant}
            onClear={() => {
                state.setSelectedKey(null);
            }}
        />
    );
};

FieldSelectClearButton.displayName = 'FieldSelectClearButton';

/** Clear for multi Select. */
export const FieldMultiSelectClearButton = ({ isDisabled, size, variant }: IAdapterProps) => {
    const state = useContext(SelectStateContext);

    if (!state || isEmptyMultiValue(state.value) || isDisabled) {
        return null;
    }

    return (
        <FieldClearButton
            isDisabled={isDisabled}
            size={size}
            variant={variant}
            onClear={() => {
                state.setValue([]);
            }}
        />
    );
};

FieldMultiSelectClearButton.displayName = 'FieldMultiSelectClearButton';

/** Clear for single ComboBox. */
export const FieldComboBoxClearButton = ({ isDisabled, size, variant }: IAdapterProps) => {
    const state = useContext(ComboBoxStateContext);
    const selected = state?.value;

    if (!state || selected == null || selected === '' || isDisabled) {
        return null;
    }

    return (
        <FieldClearButton
            isDisabled={isDisabled}
            size={size}
            variant={variant}
            onClear={() => {
                state.setValue(null);
                state.setInputValue('');
            }}
        />
    );
};

FieldComboBoxClearButton.displayName = 'FieldComboBoxClearButton';

/** Clear for multi ComboBox. */
export const FieldMultiComboBoxClearButton = ({ isDisabled, size, variant }: IAdapterProps) => {
    const state = useContext(ComboBoxStateContext);

    if (!state || isEmptyMultiValue(state.value) || isDisabled) {
        return null;
    }

    return (
        <FieldClearButton
            isDisabled={isDisabled}
            size={size}
            variant={variant}
            onClear={() => {
                state.setValue([]);
                state.setInputValue('');
            }}
        />
    );
};

FieldMultiComboBoxClearButton.displayName = 'FieldMultiComboBoxClearButton';
