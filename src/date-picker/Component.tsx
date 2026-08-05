import { useEffect, useRef, useState } from 'react';

import { CalendarDate, type DateValue } from '@internationalized/date';
import cn from 'classnames';
import {
    Button as RacButton,
    DatePicker as RacDatePicker,
    DateInput,
    DateSegment,
    Dialog,
    Group,
    Popover,
} from 'react-aria-components';

import { DEFAULT_YEAR_MAX, DEFAULT_YEAR_MIN, ScrollCalendar } from '@/calendar';
import { Calendar, Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { datePickerGroupVariants } from './theme';
import { type IDatePickerProps } from './types';

import styles from './styles.module.css';

const hasDateValue = (value: DateValue | null | undefined) => value != null;

const DEFAULT_MIN_VALUE = new CalendarDate(DEFAULT_YEAR_MIN, 1, 1);
const DEFAULT_MAX_VALUE = new CalendarDate(DEFAULT_YEAR_MAX, 12, 31);

const isValidDateValue = (
    value: DateValue | null | undefined,
    minValue: DateValue,
    maxValue: DateValue
): value is DateValue => value != null && value.compare(minValue) >= 0 && value.compare(maxValue) <= 0;

export const DatePicker = ({
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
    minValue,
    maxValue,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    ...props
}: IDatePickerProps) => {
    const { clear: clearLabel, openCalendar } = useAuiLabels();
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<DateValue | null>(() => defaultValue ?? null);
    const [isOpen, setOpen] = useState(false);
    const currentValue = isControlled ? value : uncontrolledValue;
    const showClear = clear && !disabled && hasDateValue(currentValue);
    const resolvedMin = minValue ?? DEFAULT_MIN_VALUE;
    const resolvedMax = maxValue ?? DEFAULT_MAX_VALUE;
    const lastValidRef = useRef<DateValue | null>(
        isValidDateValue(currentValue, resolvedMin, resolvedMax) ? currentValue : null
    );
    const currentValueRef = useRef(currentValue);
    currentValueRef.current = currentValue;
    const openModalityRef = useRef<'pointer' | 'keyboard'>('pointer');

    useEffect(() => {
        if (isValidDateValue(currentValue, resolvedMin, resolvedMax)) {
            lastValidRef.current = currentValue;
        }
    }, [currentValue, resolvedMin, resolvedMax]);

    const setValue = (next: DateValue | null) => {
        if (!isControlled) {
            setUncontrolledValue(next);
        }
        if (isValidDateValue(next, resolvedMin, resolvedMax)) {
            lastValidRef.current = next;
        }
        if (next == null) {
            lastValidRef.current = null;
        }
        onChange?.(next);
    };

    const handleBlur: NonNullable<IDatePickerProps['onBlur']> = event => {
        if (!isValidDateValue(currentValueRef.current, resolvedMin, resolvedMax)) {
            setValue(lastValidRef.current);
        }
        onBlur?.(event);
    };

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
    };

    return (
        <RacDatePicker
            {...props}
            value={currentValue}
            onChange={setValue}
            isDisabled={disabled}
            isInvalid={invalid}
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            onBlur={handleBlur}
            minValue={resolvedMin}
            maxValue={resolvedMax}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            className={cn(styles.root, block && styles.block, className)}
        >
            <Group
                ref={ref}
                className={datePickerGroupVariants({ size, variant, block })}
                data-invalid={invalid || undefined}
                data-disabled={disabled || undefined}
                data-test-id={dataTestId}
            >
                <DateInput className={styles.input}>
                    {segment => <DateSegment segment={segment} className={styles.segment} />}
                </DateInput>
                <span className={styles.actions}>
                    {showClear ? (
                        <RacButton
                            // Keep clear out of the DatePicker trigger slot.
                            slot={null}
                            className={styles.clear}
                            aria-label={clearLabel}
                            data-test-id="date-picker-clear"
                            excludeFromTabOrder
                            onPress={() => setValue(null)}
                        >
                            <Clear className={styles.icon} />
                        </RacButton>
                    ) : null}
                    <RacButton
                        className={styles.iconButton}
                        aria-label={openCalendar}
                        data-test-id="date-picker-calendar"
                        onPressStart={event => {
                            openModalityRef.current = event.pointerType === 'keyboard' ? 'keyboard' : 'pointer';
                        }}
                    >
                        <Calendar className={styles.icon} />
                    </RacButton>
                </span>
            </Group>
            <Popover className={styles.popover} placement="bottom start">
                <Dialog>
                    <ScrollCalendar
                        scrollToDate={currentValue}
                        autoFocusDay={isOpen && openModalityRef.current === 'keyboard'}
                    />
                </Dialog>
            </Popover>
        </RacDatePicker>
    );
};

DatePicker.displayName = 'DatePicker';
