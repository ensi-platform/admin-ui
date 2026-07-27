import { useContext } from 'react';

import { ComboBoxStateContext } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { type TMultiAutocompleteSize, type TMultiAutocompleteVariant } from '../../types';

import { multiAutocompleteClearVariants } from './theme';

import styles from './styles.module.css';

const isEmptyValue = (value: unknown): boolean => {
    if (value == null) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return false;
};

export const MultiAutocompleteClearButton = ({
    isDisabled,
    size,
    variant,
}: {
    isDisabled: boolean;
    size: TMultiAutocompleteSize;
    variant: TMultiAutocompleteVariant;
}) => {
    const state = useContext(ComboBoxStateContext);
    const { clear } = useAuiLabels();

    if (!state || isEmptyValue(state.value) || isDisabled) {
        return null;
    }

    return (
        <button
            type="button"
            className={multiAutocompleteClearVariants({ size, variant })}
            aria-label={clear}
            onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                state.setValue([]);
                state.setInputValue('');
            }}
        >
            <Clear className={styles.root} />
        </button>
    );
};

MultiAutocompleteClearButton.displayName = 'MultiAutocompleteClearButton';
