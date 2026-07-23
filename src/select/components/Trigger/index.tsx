import { Button as RacButton, SelectValue } from 'react-aria-components';

import { ChevronDown } from '../../../icons/index.js';
import { type TSelectSize } from '../../types.js';
import { SelectClearButton } from '../ClearButton/index.js';

import { selectTriggerVariants } from './theme.js';

import styles from './styles.module.css';

export interface ISelectTriggerProps {
    size: TSelectSize;
    clear: boolean;
    isFocusVisible: boolean;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
}

export const SelectTrigger = ({ size, clear, isFocusVisible, isOpen, isDisabled, isInvalid }: ISelectTriggerProps) => (
    <div
        className={styles.triggerWrap}
        data-size={size}
        data-clear={clear || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-open={isOpen || undefined}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
    >
        <RacButton className={selectTriggerVariants({ size })}>
            <SelectValue className={styles.value} />
            <span className={styles.chevronSlot}>
                <ChevronDown className={styles.chevron} />
            </span>
        </RacButton>
        {clear ? (
            <div className={styles.clearSlot}>
                <SelectClearButton isDisabled={isDisabled} />
            </div>
        ) : null}
    </div>
);

SelectTrigger.displayName = 'SelectTrigger';
