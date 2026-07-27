import { type MouseEvent, type RefObject, useContext } from 'react';

import cn from 'classnames';
import { Button as RacButton, Group, Input, SelectStateContext, SelectValue } from 'react-aria-components';

import { FieldComboBoxClearButton, FieldSelectClearButton } from '@/field-clear-button';
import { ChevronDown } from '@/icons';

import { type TComboboxSize, type TComboboxVariant } from '../../types';
import { isInteractiveTarget } from '../../utils';

import { comboboxTriggerVariants } from './theme';

import styles from './styles.module.css';

export interface IComboboxTriggerProps {
    triggerRef: RefObject<HTMLDivElement | null>;
    size: TComboboxSize;
    variant: TComboboxVariant;
    clear: boolean;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    /** Select uses focus-visible; combobox uses focus-within on Group. */
    mode: 'select' | 'combobox';
    /** Select-only. */
    isFocusVisible?: boolean;
    /** Combobox placeholder for Input. */
    placeholder?: string;
}

export const ComboboxTrigger = ({
    triggerRef,
    size,
    variant,
    clear,
    isOpen,
    isDisabled,
    isInvalid,
    mode,
    isFocusVisible = false,
    placeholder = '',
}: IComboboxTriggerProps) => {
    const selectState = useContext(SelectStateContext);

    const openFromField = (event: MouseEvent) => {
        if (mode !== 'select' || isDisabled || isInteractiveTarget(event.target)) {
            return;
        }

        selectState?.open();
    };

    const ClearButton = mode === 'select' ? FieldSelectClearButton : FieldComboBoxClearButton;

    return (
        <div
            className={styles.triggerWrap}
            data-focus-visible={mode === 'select' && isFocusVisible ? true : undefined}
            data-open={isOpen || undefined}
            data-disabled={isDisabled || undefined}
            data-invalid={isInvalid || undefined}
        >
            <Group
                ref={triggerRef}
                className={cn(
                    comboboxTriggerVariants({ size, variant }),
                    mode === 'combobox' && styles.triggerCombobox
                )}
                onClick={mode === 'select' ? openFromField : undefined}
            >
                {mode === 'select' ? (
                    <SelectValue className={styles.value}>
                        {({ selectedText, isPlaceholder }) => (isPlaceholder ? null : selectedText)}
                    </SelectValue>
                ) : (
                    <Input className={styles.input} placeholder={placeholder} disabled={isDisabled} />
                )}
                <span className={styles.actions}>
                    {clear ? <ClearButton isDisabled={isDisabled} size={size} variant={variant} /> : null}
                    <RacButton className={styles.chevronButton} isDisabled={isDisabled}>
                        <ChevronDown className={styles.chevron} />
                    </RacButton>
                </span>
            </Group>
        </div>
    );
};

ComboboxTrigger.displayName = 'ComboboxTrigger';
