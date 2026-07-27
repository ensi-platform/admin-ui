import { useContext } from 'react';

import { ComboBoxStateContext } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { type TAutocompleteSize, type TAutocompleteVariant } from '../../types';

import { autocompleteClearVariants } from './theme';

import styles from './styles.module.css';

export const AutocompleteClearButton = ({
    isDisabled,
    size,
    variant,
}: {
    isDisabled: boolean;
    size: TAutocompleteSize;
    variant: TAutocompleteVariant;
}) => {
    const state = useContext(ComboBoxStateContext);
    const { clear } = useAuiLabels();
    const selected = state?.value;

    if (!state || selected == null || selected === '' || isDisabled) {
        return null;
    }

    return (
        <button
            type="button"
            className={autocompleteClearVariants({ size, variant })}
            aria-label={clear}
            onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                state.setValue(null);
                state.setInputValue('');
            }}
        >
            <Clear className={styles.root} />
        </button>
    );
};

AutocompleteClearButton.displayName = 'AutocompleteClearButton';
