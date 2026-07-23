import { useContext } from 'react';

import { SelectStateContext } from 'react-aria-components';

import { Clear } from '../../../icons/index.js';
import { useAuiLabels } from '../../../provider/index.js';

import styles from './styles.module.css';

export const SelectClearButton = ({ isDisabled }: { isDisabled: boolean }) => {
    const state = useContext(SelectStateContext);
    const { clear } = useAuiLabels();

    if (!state || state.selectedKey == null || isDisabled) {
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
                state.setSelectedKey(null);
            }}
        >
            <Clear className={styles.root} />
        </button>
    );
};

SelectClearButton.displayName = 'SelectClearButton';
