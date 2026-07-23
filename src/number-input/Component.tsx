import cn from 'classnames';
import { Group, Input as RacInput, NumberField } from 'react-aria-components';

import { numberInputGroupVariants } from './theme.js';
import { type INumberInputProps } from './types.js';

import styles from './styles.module.css';

const toRacValue = (value: number | null | undefined) => (value == null || Number.isNaN(value) ? Number.NaN : value);

export const NumberInput = ({
    ref,
    size = 'md',
    isInvalid = false,
    disabled = false,
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

    return (
        <NumberField
            {...props}
            className={cn(styles.root, className)}
            value={isControlled ? toRacValue(value) : undefined}
            defaultValue={defaultValue === undefined ? undefined : toRacValue(defaultValue)}
            onChange={next => {
                onChange?.(Number.isNaN(next) ? null : next);
            }}
            isDisabled={disabled}
            isInvalid={isInvalid}
            minValue={min}
            maxValue={max}
            step={step}
            aria-label={ariaLabel}
        >
            <Group
                className={numberInputGroupVariants({ size })}
                data-test-id={dataTestId}
                isInvalid={isInvalid}
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
                    aria-invalid={isInvalid || undefined}
                    className={styles.fieldInput}
                />
                {suffix ? <span className={styles.addon}>{suffix}</span> : null}
            </Group>
        </NumberField>
    );
};

NumberInput.displayName = 'NumberInput';
