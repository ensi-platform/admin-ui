import {
    type FocusEvent,
    type MouseEvent,
    type RefObject,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    Button as RacButton,
    ComboBoxStateContext,
    Group,
    Input,
    type Key,
    SelectStateContext,
} from 'react-aria-components';

import { FieldMultiComboBoxClearButton, FieldMultiSelectClearButton } from '@/field-clear-button';
import { ChevronDown } from '@/icons';

import { useSelectedOptionsCache } from '../../hooks/useSelectedOptionsCache';
import { type IComboboxOption, type TComboboxSize, type TComboboxVariant } from '../../types';
import { isInteractiveTarget, toKeyList } from '../../utils';

import { SelectedTags } from './SelectedTags';
import { comboboxMultiTriggerVariants } from './theme';

import styles from './styles.module.css';

/** Clears filter input when a value is added to the selection. */
const useClearInputOnSelect = (selectionLength: number, enabled: boolean) => {
    const state = useContext(ComboBoxStateContext);
    const prevLengthRef = useRef(selectionLength);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (selectionLength > prevLengthRef.current) {
            state?.setInputValue('');
        }

        prevLengthRef.current = selectionLength;
    }, [enabled, selectionLength, state]);
};

export interface IComboboxMultiTriggerProps {
    triggerRef: RefObject<HTMLDivElement | null>;
    options: IComboboxOption[];
    size: TComboboxSize;
    variant: TComboboxVariant;
    clear: boolean;
    placeholder: string;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    mode: 'select' | 'combobox';
    isFocusVisible?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

export const ComboboxMultiTrigger = ({
    triggerRef,
    options,
    size,
    variant,
    clear,
    placeholder,
    isOpen,
    isDisabled,
    isInvalid,
    mode,
    isFocusVisible = false,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
}: IComboboxMultiTriggerProps) => {
    const selectState = useContext(SelectStateContext);
    const comboState = useContext(ComboBoxStateContext);
    const wrapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputSizerRef = useRef<HTMLSpanElement>(null);
    const [expanded, setExpanded] = useState(false);

    const selectedKeys = useMemo(() => {
        if (mode === 'combobox') {
            return toKeyList(comboState?.value);
        }

        return toKeyList(selectState?.value);
    }, [mode, comboState?.value, selectState?.value]);

    const items = useSelectedOptionsCache(selectedKeys, options);
    const inputValue = comboState?.inputValue ?? '';

    useClearInputOnSelect(items.length, mode === 'combobox');

    useEffect(() => {
        if (!isOpen) {
            setExpanded(false);
        }
    }, [isOpen]);

    const handleWrapBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (mode !== 'combobox') {
            return;
        }

        const next = event.relatedTarget;

        if (next instanceof Node && wrapRef.current?.contains(next)) {
            return;
        }

        setExpanded(false);
    };

    const openFromField = (event: MouseEvent) => {
        if (isDisabled || isInteractiveTarget(event.target)) {
            return;
        }

        if (mode === 'select') {
            selectState?.open();

            return;
        }

        comboState?.open();
        inputRef.current?.focus();
    };

    const handleRemove = (keys: Set<Key>) => {
        if (mode === 'combobox') {
            const current = toKeyList(comboState?.value);

            comboState?.setValue(current.filter(key => !keys.has(key)));

            return;
        }

        const current = toKeyList(selectState?.value);

        selectState?.setValue(current.filter(key => !keys.has(key)));
    };

    const ClearButton = mode === 'select' ? FieldMultiSelectClearButton : FieldMultiComboBoxClearButton;
    const showSelectPlaceholder = mode === 'select' && items.length === 0;

    const trailingSlot =
        mode === 'combobox' ? (
            <>
                <Input ref={inputRef} className={styles.input} placeholder={placeholder} disabled={isDisabled} />
                <span ref={inputSizerRef} className={styles.inputSizer} aria-hidden>
                    {inputValue}
                </span>
            </>
        ) : undefined;

    return (
        <div
            ref={wrapRef}
            className={styles.triggerWrap}
            data-focus-visible={mode === 'select' && isFocusVisible ? true : undefined}
            data-open={isOpen || undefined}
            data-disabled={isDisabled || undefined}
            data-invalid={isInvalid || undefined}
            onBlur={handleWrapBlur}
        >
            <Group
                ref={triggerRef}
                className={comboboxMultiTriggerVariants({ size, variant })}
                onClick={openFromField}
            >
                {showSelectPlaceholder ? (
                    <span className={styles.placeholder}>{placeholder}</span>
                ) : (
                    <SelectedTags
                        items={items}
                        size={size}
                        expanded={expanded}
                        onExpandedChange={setExpanded}
                        onRemove={handleRemove}
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledby}
                        trailingSlot={trailingSlot}
                        trailingReserveRef={mode === 'combobox' ? inputSizerRef : undefined}
                        trailingContentKey={mode === 'combobox' ? inputValue : undefined}
                    />
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

ComboboxMultiTrigger.displayName = 'ComboboxMultiTrigger';
