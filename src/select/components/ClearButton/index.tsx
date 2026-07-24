import { useContext } from 'react';

import { SelectStateContext } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { type TSelectSize, type TSelectVariant } from '../../types';

import { selectClearVariants } from './theme';

import styles from './styles.module.css';

export const SelectClearButton = ({
    isDisabled,
    size,
    variant,
}: {
    isDisabled: boolean;
    size: TSelectSize;
    variant: TSelectVariant;
}) => {
    const state = useContext(SelectStateContext);
    const { clear } = useAuiLabels();

    if (!state || state.selectedKey == null || isDisabled) {
        return null;
    }

    return (
        <button
            type="button"
            className={selectClearVariants({ size, variant })}
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
