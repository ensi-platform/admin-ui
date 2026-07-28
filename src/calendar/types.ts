import { type DateValue } from '@internationalized/date';

/** Own / chrome props for internal calendar. */
export interface IScrollCalendarProps {
    /** Initial month to scroll into view (selected or today). */
    scrollToDate?: DateValue | null;
    className?: string;
    /** Focus a day cell when the popover opens (keyboard open). */
    autoFocusDay?: boolean;
}
