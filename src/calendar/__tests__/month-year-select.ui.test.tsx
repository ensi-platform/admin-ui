import { type ComponentProps, type Key } from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { MonthYearSelect } from '../components/MonthYearSelect';

import type * as ReactAriaComponents from 'react-aria-components';

const selectionHandlers: ((key: Key | null) => void)[] = [];

vi.mock('react-aria-components', async importOriginal => {
    const actual = await importOriginal<typeof ReactAriaComponents>();
    type TSelectProps = ComponentProps<typeof actual.Select>;
    return {
        ...actual,
        Select: (props: TSelectProps) => {
            selectionHandlers.push(props.onSelectionChange as (key: Key | null) => void);
            return <actual.Select {...props} />;
        },
    };
});

const renderSelect = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);
const noopChange = vi.fn();

describe('MonthYearSelect', () => {
    beforeEach(() => {
        selectionHandlers.length = 0;
        noopChange.mockClear();
    });

    it('scrolls selected option into view on open', async () => {
        const user = userEvent.setup();
        const scrollIntoView = vi.fn();
        const original = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = scrollIntoView;

        try {
            renderSelect(
                <MonthYearSelect type="year" value={2024} minValue={2020} maxValue={2030} onChange={noopChange} />
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

    it('ignores null selection keys', () => {
        const onChange = vi.fn();
        renderSelect(<MonthYearSelect type="month" value={6} minValue={1} maxValue={12} onChange={onChange} />);

        expect(selectionHandlers.length).toBeGreaterThan(0);
        act(() => {
            selectionHandlers.at(-1)?.(null);
        });
        expect(onChange).not.toHaveBeenCalled();
    });

    it('uses numeric display when month value is out of labels', () => {
        renderSelect(<MonthYearSelect type="month" value={13} minValue={1} maxValue={12} onChange={noopChange} />);
        expect(screen.getByTestId('calendar-month-select-trigger')).toHaveTextContent('13');
    });

    it('keeps selectedKey null when value is outside items range', () => {
        renderSelect(
            <MonthYearSelect type="year" value={2024} minValue={2025} maxValue={2030} onChange={noopChange} />
        );
        expect(screen.getByTestId('calendar-year-select-trigger')).toHaveTextContent('2024');
    });

    it('ignores same value and non-numeric selection keys', () => {
        const onChange = vi.fn();
        renderSelect(<MonthYearSelect type="month" value={6} minValue={1} maxValue={12} onChange={onChange} />);

        act(() => {
            selectionHandlers.at(-1)?.('6');
            selectionHandlers.at(-1)?.('abc');
        });
        expect(onChange).not.toHaveBeenCalled();
    });
});
