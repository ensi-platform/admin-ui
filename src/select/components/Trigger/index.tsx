import { type MouseEvent, type RefObject, useContext } from 'react';

import { Button as RacButton, Group, SelectStateContext, SelectValue } from 'react-aria-components';

import { ChevronDown } from '@/icons';

import { type TSelectSize, type TSelectVariant } from '../../types';
import { isInteractiveTarget } from '../../utils';
import { SelectClearButton } from '../ClearButton';

import { selectTriggerVariants } from './theme';

import styles from './styles.module.css';

export interface ISelectTriggerProps {
    triggerRef: RefObject<HTMLDivElement | null>;
    size: TSelectSize;
    variant: TSelectVariant;
    clear: boolean;
    isFocusVisible: boolean;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
}

export const SelectTrigger = ({
    triggerRef,
    size,
    variant,
    clear,
    isFocusVisible,
    isOpen,
    isDisabled,
    isInvalid,
}: ISelectTriggerProps) => {
    const selectState = useContext(SelectStateContext);

    const openFromField = (event: MouseEvent) => {
        if (isDisabled || isInteractiveTarget(event.target)) {
            return;
        }

        selectState?.open();
    };

    return (
        <div
            className={styles.triggerWrap}
            data-focus-visible={isFocusVisible || undefined}
            data-open={isOpen || undefined}
            data-disabled={isDisabled || undefined}
            data-invalid={isInvalid || undefined}
        >
            <Group ref={triggerRef} className={selectTriggerVariants({ size, variant })} onClick={openFromField}>
                <SelectValue className={styles.value}>
                    {({ selectedText, isPlaceholder }) => (isPlaceholder ? null : selectedText)}
                </SelectValue>
                <span className={styles.actions}>
                    {clear ? <SelectClearButton isDisabled={isDisabled} size={size} variant={variant} /> : null}
                    <RacButton className={styles.chevronButton} isDisabled={isDisabled}>
                        <ChevronDown className={styles.chevron} />
                    </RacButton>
                </span>
            </Group>
        </div>
    );
};

SelectTrigger.displayName = 'SelectTrigger';
