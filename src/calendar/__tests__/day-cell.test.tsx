import { CalendarDate } from '@internationalized/date';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DayCell } from '../components/DayCell';

describe('DayCell', () => {
    const date = new CalendarDate(2024, 6, 15);

    it('defaults tabIndex from isFocused when tabIndex prop is omitted', () => {
        const { rerender } = render(<DayCell date={date} label="15" isFocused />);
        expect(document.querySelector('[data-date="2024-06-15"]')).toHaveAttribute('tabindex', '0');

        rerender(<DayCell date={date} label="15" isFocused={false} />);
        expect(document.querySelector('[data-date="2024-06-15"]')).toHaveAttribute('tabindex', '-1');
    });

    it('honors explicit tabIndex over isFocused', () => {
        render(<DayCell date={date} label="15" isFocused={false} tabIndex={0} />);
        expect(document.querySelector('[data-date="2024-06-15"]')).toHaveAttribute('tabindex', '0');
    });
});
