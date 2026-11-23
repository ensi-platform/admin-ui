import {
    createContext,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
    type RefObject,
    useContext,
    useRef,
} from 'react';

import cn from 'classnames';
import {
    Button as RacButton,
    ComboBoxStateContext,
    Group,
    Input,
    SelectStateContext,
    SelectValue,
} from 'react-aria-components';

import { FieldComboBoxClearButton, FieldSelectClearButton } from '@/field-clear-button';
import { ChevronDown } from '@/icons';

import { type TComboboxSize, type TComboboxVariant } from '../../types';
import { isInteractiveTarget } from '../../utils';

import { comboboxTriggerVariants } from './theme';

import styles from './styles.module.css';

// Parents set this to false when Tab must leave the field without committing the highlight.
export const CommitHighlightedOnTabContext = createContext(true);

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
    const comboState = useContext(ComboBoxStateContext);
    const commitHighlightedOnTab = useContext(CommitHighlightedOnTabContext);
    const inputRef = useRef<HTMLInputElement>(null);

    const focusChevron = () => {
        triggerRef.current?.querySelector<HTMLButtonElement>(`.${styles.chevronButton}`)?.focus();
    };

    const primeSelectFocus = (event: PointerEvent<HTMLDivElement>) => {
        if (mode !== 'select' || isDisabled || isInteractiveTarget(event.target)) {
            return;
        }

        focusChevron();
    };

    const openFromField = (event: MouseEvent) => {
        if (isDisabled || isInteractiveTarget(event.target)) {
            return;
        }

        if (mode === 'select') {
            focusChevron();
            selectState?.open();

            return;
        }

        comboState?.open();
        inputRef.current?.focus();
    };

    const ClearButton = mode === 'select' ? FieldSelectClearButton : FieldComboBoxClearButton;

    const keepSelectionOnTab = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!comboState || mode !== 'combobox' || commitHighlightedOnTab || event.key !== 'Tab' || !comboState.isOpen) {
            return;
        }

        const { value, selectedItems, inputValue } = comboState;
        const selectedValue = Array.isArray(value) ? value[0] : value;

        if (selectedValue == null || selectedValue === '') {
            return;
        }

        const selectedText = selectedItems[0]?.textValue;

        if (selectedText != null && inputValue === selectedText) {
            return;
        }

        event.stopPropagation();
        comboState.close();
    };

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
                onPointerDown={primeSelectFocus}
                onClick={openFromField}
                onKeyDownCapture={keepSelectionOnTab}
            >
                {mode === 'select' ? (
                    <SelectValue className={styles.value}>
                        {({ selectedText, isPlaceholder }) => (isPlaceholder ? null : selectedText)}
                    </SelectValue>
                ) : (
                    <Input ref={inputRef} className={styles.input} placeholder={placeholder} disabled={isDisabled} />
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
