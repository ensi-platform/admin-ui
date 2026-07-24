import { useState } from 'react';

import cn from 'classnames';
import { Group, Input as RacInput, NumberField } from 'react-aria-components';

import { Clear } from '@/icons';
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

export const NumberInput = ({
    ref,
    size = 'md',
    variant = 'primary',
    block = true,
    invalid = false,
    disabled = false,
    clear = false,
    value,
    defaultValue,
    onChange,
    onBlur,
    min,
    max,
    step,
    prefix,
    suffix,
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
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(() =>
        defaultValue === undefined || Number.isNaN(defaultValue) ? null : defaultValue
    );
    const currentValue = isControlled ? value : uncontrolledValue;
    const showClear = clear && !disabled && hasNumberValue(currentValue);
    /** When `clear` is on, drive RAC as controlled so clear can reset the field. */
    const driveValue = isControlled || clear;

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
            isInvalid={invalid}
            minValue={min}
            maxValue={max}
            step={step}
            aria-label={ariaLabel}
        >
            <Group
                className={numberInputGroupVariants({ size, variant, block })}
                data-test-id={dataTestId}
                isInvalid={invalid}
                isDisabled={disabled}
            >
                {prefix ? <span className={styles.addon}>{prefix}</span> : null}
                <RacInput
                    ref={ref}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    onBlur={onBlur}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
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
                {suffix ? <span className={styles.addon}>{suffix}</span> : null}
            </Group>
        </NumberField>
    );
};

NumberInput.displayName = 'NumberInput';
