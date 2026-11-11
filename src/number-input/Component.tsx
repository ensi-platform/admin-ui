import { useRef, useState } from 'react';

import cn from 'classnames';
import { Group, Input as RacInput, NumberField } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { Clear } from '@/icons';
import { AddonButton, ControlAddon } from '@/input/components/Addon';
import { useAuiLabels } from '@/provider';

import { numberInputGroupVariants } from './theme';
import { type INumberInputProps } from './types';

import styles from './styles.module.css';

const toRacValue = (value: number | null | undefined) => (value == null || Number.isNaN(value) ? Number.NaN : value);

const hasNumberValue = (value: number | null | undefined) => value != null && !Number.isNaN(value);

const NumberInputClearButton = ({ onClear }: { onClear: () => void }) => {
    const { clear } = useAuiLabels();

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
                onClear();
            }}
        >
            <Clear className={styles.clearIcon} />
        </button>
    );
};

const NumberInputRoot = supportRef(
    ({
        ref,
        size = 'md',
        variant = 'primary',
        block = true,
        invalid = false,
        disabled = false,
        readOnly = false,
        clear = false,
        value,
        defaultValue,
        onChange,
        onBlur,
        min,
        max,
        step,
        leftAddon,
        rightAddon,
        placeholder,
        name,
        id,
        className,
        dataTestId,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        ...props
    }: INumberInputProps) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const isControlled = value !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(() =>
            defaultValue === undefined || Number.isNaN(defaultValue) ? null : defaultValue
        );
        const currentValue = isControlled ? value : uncontrolledValue;
        const showClear = clear && !disabled && !readOnly && hasNumberValue(currentValue);
        /** When `clear` is on, drive RAC as controlled so clear can reset the field. */
        const driveValue = isControlled || clear;
        /** Prefer explicit aria-label over Field's phantom labelledby when Label is absent. */
        const labelledBy = ariaLabel ? undefined : ariaLabelledby;

        return (
            <NumberField
                {...props}
                className={cn(styles.root, className)}
                value={driveValue ? toRacValue(currentValue) : undefined}
                defaultValue={!driveValue && defaultValue !== undefined ? toRacValue(defaultValue) : undefined}
                onChange={next => {
                    const nextValue = Number.isNaN(next) ? null : next;

                    if (!isControlled) {
                        setUncontrolledValue(nextValue);
                    }

                    onChange?.(nextValue);
                }}
                isDisabled={disabled}
                isReadOnly={readOnly}
                isInvalid={invalid}
                minValue={min}
                maxValue={max}
                step={step}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
            >
                <Group
                    className={numberInputGroupVariants({ size, variant, block })}
                    data-test-id={dataTestId}
                    isInvalid={invalid}
                    isDisabled={disabled}
                    isReadOnly={readOnly}
                >
                    {leftAddon ? (
                        <ControlAddon disabled={disabled} onFocusControl={() => inputRef.current?.focus()}>
                            {leftAddon}
                        </ControlAddon>
                    ) : null}
                    <RacInput
                        ref={node => {
                            inputRef.current = node;

                            if (typeof ref === 'function') {
                                ref(node);
                                return;
                            }

                            if (ref) ref.current = node;
                        }}
                        name={name}
                        id={id}
                        placeholder={placeholder}
                        onBlur={onBlur}
                        aria-label={ariaLabel}
                        aria-labelledby={labelledBy}
                        aria-describedby={ariaDescribedby}
                        aria-invalid={invalid || undefined}
                        className={styles.fieldInput}
                    />
                    {showClear ? (
                        <NumberInputClearButton
                            onClear={() => {
                                if (!isControlled) {
                                    setUncontrolledValue(null);
                                }

                                onChange?.(null);
                            }}
                        />
                    ) : null}
                    {rightAddon ? (
                        <ControlAddon disabled={disabled} onFocusControl={() => inputRef.current?.focus()}>
                            {rightAddon}
                        </ControlAddon>
                    ) : null}
                </Group>
            </NumberField>
        );
    }
);

NumberInputRoot.displayName = 'NumberInput';

export const NumberInput = Object.assign(NumberInputRoot, { AddonButton });
