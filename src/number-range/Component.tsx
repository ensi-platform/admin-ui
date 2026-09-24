import { useState } from 'react';

import cn from 'classnames';

import { NumberInput } from '@/number-input';

import { type INumberRangeProps, type INumberRangeValue } from './types';
import { alignNumberRange, type TNumberRangeSide } from './utils';

import styles from './styles.module.css';

const EMPTY_RANGE: INumberRangeValue = { from: null, to: null };

export const NumberRange = ({
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
    formatOptions,
    fromPlaceholder,
    toPlaceholder,
    fromLabel,
    toLabel,
    className,
    dataTestId,
    'aria-describedby': ariaDescribedby,
    ...props
}: INumberRangeProps) => {
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<INumberRangeValue>(() => defaultValue ?? EMPTY_RANGE);
    const currentValue = isControlled ? value : uncontrolledValue;

    const emit = (side: TNumberRangeSide, next: number | null) => {
        const aligned = alignNumberRange(currentValue, side, next);

        if (!isControlled) {
            setUncontrolledValue(aligned);
        }

        onChange?.(aligned);
    };

    const fieldProps = {
        className: block ? styles.field : undefined,
        size,
        variant,
        block,
        invalid,
        disabled,
        clear,
        onBlur,
        min,
        max,
        step,
        formatOptions,
    };

    return (
        <div
            {...props}
            ref={ref}
            className={cn(styles.root, block && styles.block, className)}
            data-test-id={dataTestId}
        >
            <NumberInput
                {...fieldProps}
                value={currentValue.from}
                onChange={next => emit('from', next)}
                placeholder={fromPlaceholder}
                aria-label={fromLabel}
                aria-describedby={ariaDescribedby}
            />
            <NumberInput
                {...fieldProps}
                value={currentValue.to}
                onChange={next => emit('to', next)}
                placeholder={toPlaceholder}
                aria-label={toLabel}
                aria-describedby={ariaDescribedby}
            />
        </div>
    );
};

NumberRange.displayName = 'NumberRange';
