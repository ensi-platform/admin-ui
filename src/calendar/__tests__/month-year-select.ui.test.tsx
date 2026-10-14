import { type ReactElement } from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { MonthYearSelect } from '../components/MonthYearSelect';

const renderSelect = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('MonthYearSelect', () => {
    it('scrolls selected option into view on open', async () => {
        const user = userEvent.setup();
        const scrollIntoView = vi.fn();
        const original = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = scrollIntoView;

        try {
            renderSelect(
                <MonthYearSelect
                    type="year"
                    value={2024}
                    minValue={2020}
                    maxValue={2030}
                    onChange={vi.fn()}
                    aria-label="Year"
                />
            );

            await user.click(screen.getByTestId('calendar-year-select-trigger'));
            await act(async () => {
                await new Promise<void>(resolve => {
                    requestAnimationFrame(() => {
                        resolve();
                    });
                });
            });
            expect(scrollIntoView).toHaveBeenCalled();
        } finally {
            Element.prototype.scrollIntoView = original;
        }
    });

    it('commits the chosen year', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderSelect(
            <MonthYearSelect
                type="year"
                value={2024}
                minValue={2020}
                maxValue={2030}
                onChange={onChange}
                aria-label="Year"
            />
        );

        await user.click(screen.getByRole('button', { name: /Year/ }));
        await user.click(screen.getByRole('option', { name: '2026' }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(2026);
    });

    it('uses numeric display when month value is out of labels', () => {
        renderSelect(
            <MonthYearSelect type="month" value={13} minValue={1} maxValue={12} onChange={vi.fn()} aria-label="Month" />
        );
        expect(screen.getByTestId('calendar-month-select-trigger')).toHaveTextContent('13');
    });

    it('keeps selectedKey null when value is outside items range', () => {
        renderSelect(
            <MonthYearSelect
                type="year"
                value={2024}
                minValue={2025}
                maxValue={2030}
                onChange={vi.fn()}
                aria-label="Year"
            />
        );
        expect(screen.getByTestId('calendar-year-select-trigger')).toHaveTextContent('2024');
    });
});
