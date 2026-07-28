import { useEffect, useRef, useState } from 'react';

import { CalendarDate, type DateValue } from '@internationalized/date';
import cn from 'classnames';
import {
    Button as RacButton,
    DateRangePicker as RacDateRangePicker,
    DateInput,
    DateSegment,
    type DateRange,
    Dialog,
    Group,
    Popover,
} from 'react-aria-components';

import { DEFAULT_YEAR_MAX, DEFAULT_YEAR_MIN, ScrollRangeCalendar } from '@/calendar';
import { Calendar, Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { dateRangePickerGroupVariants } from './theme';
import { type IDateRangePickerProps } from './types';

import styles from './styles.module.css';

const hasRangeValue = (value: DateRange | null | undefined) => value?.start != null || value?.end != null;

const DEFAULT_MIN_VALUE = new CalendarDate(DEFAULT_YEAR_MIN, 1, 1);
const DEFAULT_MAX_VALUE = new CalendarDate(DEFAULT_YEAR_MAX, 12, 31);

const isDateInBounds = (value: DateValue, minValue: DateValue, maxValue: DateValue) =>
    value.compare(minValue) >= 0 && value.compare(maxValue) <= 0;

const isValidRangeValue = (
    value: DateRange | null | undefined,
    minValue: DateValue,
    maxValue: DateValue
): value is DateRange => {
    if (value == null) {
        return true;
    }
    if (value.start == null || value.end == null) {
        return false;
    }

    return isDateInBounds(value.start, minValue, maxValue) && isDateInBounds(value.end, minValue, maxValue);
};

export const DateRangePicker = ({
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
}: IDateRangePickerProps) => {
    const { clear: clearLabel, openCalendar } = useAuiLabels();
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<DateRange | null>(() => defaultValue ?? null);
    const [isOpen, setOpen] = useState(false);
    const currentValue = isControlled ? value : uncontrolledValue;
    const showClear = clear && !disabled && hasRangeValue(currentValue);
    const resolvedMin = minValue ?? DEFAULT_MIN_VALUE;
    const resolvedMax = maxValue ?? DEFAULT_MAX_VALUE;
    const lastValidRef = useRef<DateRange | null>(
        isValidRangeValue(currentValue, resolvedMin, resolvedMax) ? currentValue : null
    );
    const currentValueRef = useRef(currentValue);
    currentValueRef.current = currentValue;
    const openModalityRef = useRef<'pointer' | 'keyboard'>('pointer');

    useEffect(() => {
        if (isValidRangeValue(currentValue, resolvedMin, resolvedMax)) {
            lastValidRef.current = currentValue;
        }
    }, [currentValue, resolvedMin, resolvedMax]);

    const setValue = (next: DateRange | null) => {
        if (!isControlled) {
            setUncontrolledValue(next);
        }
        if (isValidRangeValue(next, resolvedMin, resolvedMax)) {
            lastValidRef.current = next;
        }
        onChange?.(next);
    };

    const handleBlur: NonNullable<IDateRangePickerProps['onBlur']> = event => {
        if (!isValidRangeValue(currentValueRef.current, resolvedMin, resolvedMax)) {
            setValue(lastValidRef.current);
        }
        onBlur?.(event);
    };

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
    };

    return (
        <RacDateRangePicker
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
                className={dateRangePickerGroupVariants({ size, variant, block })}
                data-invalid={invalid || undefined}
                data-disabled={disabled || undefined}
                data-test-id={dataTestId}
            >
                <DateInput slot="start" className={styles.input}>
                    {segment => <DateSegment segment={segment} className={styles.segment} />}
                </DateInput>
                <span aria-hidden className={styles.separator}>
                    –
                </span>
                <DateInput slot="end" className={styles.input}>
                    {segment => <DateSegment segment={segment} className={styles.segment} />}
                </DateInput>
                {showClear ? (
                    <RacButton
                        slot={null}
                        className={styles.clear}
                        aria-label={clearLabel}
                        data-test-id="date-range-picker-clear"
                        excludeFromTabOrder
                        onPress={() => setValue(null)}
                    >
                        <Clear className={styles.icon} />
                    </RacButton>
                ) : null}
                <RacButton
                    className={styles.iconButton}
                    aria-label={openCalendar}
                    data-test-id="date-range-picker-calendar"
                    onPressStart={event => {
                        openModalityRef.current = event.pointerType === 'keyboard' ? 'keyboard' : 'pointer';
                    }}
                >
                    <Calendar className={styles.icon} />
                </RacButton>
            </Group>
            <Popover className={styles.popover} placement="bottom start">
                <Dialog>
                    <ScrollRangeCalendar
                        scrollToDate={currentValue?.end ?? currentValue?.start ?? null}
                        autoFocusDay={isOpen && openModalityRef.current === 'keyboard'}
                    />
                </Dialog>
            </Popover>
        </RacDateRangePicker>
    );
};

DateRangePicker.displayName = 'DateRangePicker';
