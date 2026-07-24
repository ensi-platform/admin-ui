import { Button as RacButton, SelectValue } from 'react-aria-components';

import { ChevronDown } from '@/icons';

import { type TSelectSize, type TSelectVariant } from '../../types';
import { SelectClearButton } from '../ClearButton';

import { selectTriggerVariants } from './theme';

import styles from './styles.module.css';

export interface ISelectTriggerProps {
    size: TSelectSize;
    variant: TSelectVariant;
    clear: boolean;
    isFocusVisible: boolean;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
}

export const SelectTrigger = ({
    size,
    variant,
    clear,
    isFocusVisible,
    isOpen,
    isDisabled,
    isInvalid,
}: ISelectTriggerProps) => (
    <div
        className={styles.triggerWrap}
        data-size={size}
        data-clear={clear || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-open={isOpen || undefined}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
    >
        <RacButton className={selectTriggerVariants({ size, variant })}>
            <SelectValue className={styles.value} />
            <span className={styles.chevronSlot}>
                <ChevronDown className={styles.chevron} />
            </span>
        </RacButton>
        {clear ? (
            <div className={styles.clearSlot}>
                <SelectClearButton isDisabled={isDisabled} size={size} variant={variant} />
            </div>
        ) : null}
    </div>
);

SelectTrigger.displayName = 'SelectTrigger';
