import { useEffect, useRef, useState } from 'react';

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

import { supportRef } from '@ds/common/support-ref';

import { ScrollRangeCalendar } from '@/calendar';
import { Calendar, Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { dateRangePickerGroupVariants } from './theme';
import { type IDateRangePickerProps } from './types';
import {
    DEFAULT_RANGE_MAX_VALUE,
    DEFAULT_RANGE_MIN_VALUE,
    hasRangeValue,
    isPublishableRange,
    rangesEqual,
    resolveCommittedRange,
} from './utils';

import styles from './styles.module.css';

export const DateRangePicker = supportRef(
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
        /** In-progress edit. Keeps segment text while the parent only receives ordered ranges. */
        const [draft, setDraft] = useState<DateRange | null | undefined>(undefined);
        const currentValue = isControlled ? value : uncontrolledValue;
        const displayedValue = draft !== undefined ? draft : currentValue;
        const showClear = clear && !disabled && hasRangeValue(displayedValue);
        const resolvedMin = minValue ?? DEFAULT_RANGE_MIN_VALUE;
        const resolvedMax = maxValue ?? DEFAULT_RANGE_MAX_VALUE;
        const lastValidRef = useRef<DateRange | null>(
            isPublishableRange(currentValue, resolvedMin, resolvedMax) ? (currentValue ?? null) : null
        );
        const lastEmittedRef = useRef<DateRange | null | undefined>(lastValidRef.current);
        const draftRef = useRef(draft);
        draftRef.current = draft;
        const boundsRef = useRef({ min: resolvedMin, max: resolvedMax });
        boundsRef.current = { min: resolvedMin, max: resolvedMax };
        const currentValueRef = useRef(displayedValue);
        currentValueRef.current = displayedValue;
        const openModalityRef = useRef<'pointer' | 'keyboard'>('pointer');
        const seenValueRef = useRef(value);

        useEffect(() => {
            if (isPublishableRange(currentValue, resolvedMin, resolvedMax)) {
                lastValidRef.current = currentValue ?? null;
            }
        }, [currentValue, resolvedMin, resolvedMax]);

        useEffect(() => {
            if (!isControlled) {
                return;
            }
            if (rangesEqual(value ?? null, seenValueRef.current ?? null)) {
                seenValueRef.current = value;
                return;
            }
            seenValueRef.current = value;
            if (draftRef.current !== undefined && !rangesEqual(value ?? null, draftRef.current)) {
                draftRef.current = undefined;
                setDraft(undefined);
            }
        }, [isControlled, value]);

        const emit = (next: DateRange | null) => {
            draftRef.current = undefined;
            setDraft(undefined);
            if (!isControlled) {
                setUncontrolledValue(next);
            }
            if (isPublishableRange(next, boundsRef.current.min, boundsRef.current.max)) {
                lastValidRef.current = next;
            }
            if (rangesEqual(lastEmittedRef.current, next)) {
                return;
            }
            lastEmittedRef.current = next;
            onChange?.(next);
        };

        const setValue = (next: DateRange | null) => {
            emit(next);
        };

        const commit = () => {
            const raw = draftRef.current !== undefined ? draftRef.current : currentValueRef.current;
            const { min, max } = boundsRef.current;

            emit(resolveCommittedRange(raw, lastValidRef.current, min, max));
        };

        const handleBlur: NonNullable<IDateRangePickerProps['onBlur']> = event => {
            commit();
            onBlur?.(event);
        };

        const handleOpenChange = (open: boolean) => {
            setOpen(open);
            if (!open) {
                commit();
            }
        };

        const handleInputChange = (next: DateRange | null) => {
            draftRef.current = next;
            setDraft(next);
            if (!isControlled) {
                setUncontrolledValue(next);
            }
            if (!isPublishableRange(next, boundsRef.current.min, boundsRef.current.max)) {
                return;
            }
            lastValidRef.current = next;
            if (rangesEqual(lastEmittedRef.current, next)) {
                return;
            }
            lastEmittedRef.current = next;
            onChange?.(next);
        };

        return (
            <RacDateRangePicker
                {...props}
                value={displayedValue}
                onChange={handleInputChange}
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
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            commit();
                        }
                    }}
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
                    <span className={styles.actions}>
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
                    </span>
                </Group>
                <Popover className={styles.popover} placement="bottom start">
                    <Dialog>
                        <ScrollRangeCalendar
                            scrollToDate={displayedValue?.end ?? displayedValue?.start ?? null}
                            autoFocusDay={isOpen && openModalityRef.current === 'keyboard'}
                        />
                    </Dialog>
                </Popover>
            </RacDateRangePicker>
        );
    }
);

DateRangePicker.displayName = 'DateRangePicker';
