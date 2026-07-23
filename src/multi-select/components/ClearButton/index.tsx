import { useContext } from 'react';

import { SelectStateContext } from 'react-aria-components';

import { Clear } from '../../../icons/index.js';
import { useAuiLabels } from '../../../provider/index.js';

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

export const MultiSelectClearButton = ({ isDisabled }: { isDisabled: boolean }) => {
    const state = useContext(SelectStateContext);
    const { clear } = useAuiLabels();

    if (!state || isEmptyValue(state.value) || isDisabled) {
        return null;
    }

    return (
        <button
            type="button"
            className={styles.clear}
            aria-label={clear}
            onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                state.setValue([]);
            }}
        >
            <Clear className={styles.root} />
        </button>
    );
};

MultiSelectClearButton.displayName = 'MultiSelectClearButton';
