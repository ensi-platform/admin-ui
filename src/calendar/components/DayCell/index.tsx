import { type FocusEventHandler, type KeyboardEventHandler } from 'react';

import { type CalendarDate } from '@internationalized/date';
import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

/** Day cell chrome props. */
export interface IDayCellProps {
    date: CalendarDate;
    label: string;
    isOutsideMonth?: boolean;
    isToday?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
    isUnavailable?: boolean;
    isSelectionStart?: boolean;
    isSelectionEnd?: boolean;
    isInRange?: boolean;
    isHovered?: boolean;
    /** Roving tabindex focus target. */
    isFocused?: boolean;
    onSelect?: (date: CalendarDate) => void;
    onHoverChange?: (date: CalendarDate | null) => void;
    onFocusDate?: (date: CalendarDate) => void;
    onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}

/** Day button for custom month grid. */
export const DayCell = ({
    date,
    label,
    isOutsideMonth = false,
    isToday = false,
    isSelected = false,
    isDisabled = false,
    isUnavailable = false,
    isSelectionStart = false,
    isSelectionEnd = false,
    isInRange = false,
    isHovered = false,
    isFocused = false,
    onSelect,
    onHoverChange,
    onFocusDate,
    onKeyDown,
}: IDayCellProps) => {
    const blocked = isDisabled || isUnavailable;

    const handleFocus: FocusEventHandler<HTMLButtonElement> = () => {
        onFocusDate?.(date);
    };

    return (
        <button
            type="button"
            className={cn(styles.cell, typographyStyles.bodyS)}
            aria-label={label}
            aria-pressed={isSelected || undefined}
            disabled={blocked}
            tabIndex={isFocused ? 0 : -1}
            data-date={date.toString()}
            data-outside-month={isOutsideMonth || undefined}
            data-today={isToday || undefined}
            data-selected={isSelected || undefined}
            data-disabled={isDisabled || undefined}
            data-unavailable={isUnavailable || undefined}
            data-selection-start={isSelectionStart || undefined}
            data-selection-end={isSelectionEnd || undefined}
            data-in-range={isInRange || undefined}
            data-hovered={isHovered || undefined}
            data-focused={isFocused || undefined}
            onClick={() => onSelect?.(date)}
            onMouseEnter={() => onHoverChange?.(date)}
            onMouseLeave={() => onHoverChange?.(null)}
            onFocus={handleFocus}
            onKeyDown={isFocused ? onKeyDown : undefined}
        >
            {date.day}
        </button>
    );
};

DayCell.displayName = 'DayCell';
