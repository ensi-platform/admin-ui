import { useRef, useState } from 'react';

import cn from 'classnames';
import {
    Button as RacButton,
    DateInput,
    DateSegment,
    Group,
    TimeField as RacTimeField,
    type TimeValue,
} from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { timeFieldGroupVariants } from './theme';
import { type ITimeFieldProps } from './types';

import styles from './styles.module.css';

const hasTimeValue = (value: TimeValue | null | undefined) => value != null;

export const TimeField = supportRef(
    ({
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
        className,
        dataTestId,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        ...props
    }: ITimeFieldProps) => {
        const { clear: clearLabel } = useAuiLabels();
        const isControlled = value !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState<TimeValue | null>(() => defaultValue ?? null);
        const currentValue = isControlled ? value : uncontrolledValue;
        const showClear = clear && !disabled && hasTimeValue(currentValue);
        const committedRef = useRef<TimeValue | null>(currentValue ?? null);

        const setValue = (next: TimeValue | null) => {
            committedRef.current = next;
            if (!isControlled) {
                setUncontrolledValue(next);
            }
            onChange?.(next);
        };

        const handleChange = (next: TimeValue | null) => {
            if (!isControlled) {
                setUncontrolledValue(next);
            }
            onChange?.(next);
        };

        const handleFocus: NonNullable<ITimeFieldProps['onFocus']> = () => {
            committedRef.current = currentValue ?? null;
        };

        const handleBlur: NonNullable<ITimeFieldProps['onBlur']> = event => {
            const root = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
            const incomplete = [...(root?.querySelectorAll('[role="spinbutton"]') ?? [])].some(node => {
                const type = node.getAttribute('data-type');
                if (type !== 'hour' && type !== 'minute' && type !== 'second') {
                    return false;
                }

                return !/\d/.test(node.textContent ?? '');
            });

            if (!incomplete) {
                committedRef.current = currentValue ?? null;
                onBlur?.(event);
                return;
            }

            const restored = committedRef.current;
            if (!isControlled) {
                setUncontrolledValue(restored);
            }
            onChange?.(restored);
            onBlur?.(event);
        };

        return (
            <RacTimeField
                {...props}
                value={currentValue}
                onChange={handleChange}
                isDisabled={disabled}
                isInvalid={invalid}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                aria-describedby={ariaDescribedby}
                className={cn(styles.root, block && styles.block, className)}
                data-test-id={dataTestId}
            >
                <Group
                    ref={ref}
                    className={timeFieldGroupVariants({ size, variant, block })}
                    data-invalid={invalid || undefined}
                    data-disabled={disabled || undefined}
                >
                    <DateInput className={styles.input}>
                        {segment => <DateSegment segment={segment} className={styles.segment} />}
                    </DateInput>
                    {showClear ? (
                        <RacButton
                            slot={null}
                            className={styles.clear}
                            aria-label={clearLabel}
                            excludeFromTabOrder
                            onPress={() => setValue(null)}
                        >
                            <Clear className={styles.icon} />
                        </RacButton>
                    ) : null}
                </Group>
            </RacTimeField>
        );
    }
);

TimeField.displayName = 'TimeField';
