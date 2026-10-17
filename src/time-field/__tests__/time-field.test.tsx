import { useState } from 'react';

import { Time } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type TimeValue } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { TimeField } from '..';

import styles from '../styles.module.css';

const renderField = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('TimeField', () => {
    it('renders time field', () => {
        renderField(<TimeField aria-label="Время" dataTestId="time" />);
        expect(screen.getByTestId('time')).toBeInTheDocument();
    });

    it('clears value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderField(<TimeField aria-label="Время" clear value={new Time(14, 30)} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('clears uncontrolled defaultValue', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderField(<TimeField aria-label="Время" clear defaultValue={new Time(14, 30)} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        expect(onChange).toHaveBeenCalledWith(null);
        expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument();
    });

    it('follows value and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = renderField(<TimeField aria-label="Время" value={new Time(9, 0)} onChange={onChange} />);

        rerender(
            <AdminUiProvider>
                <TimeField aria-label="Время" value={new Time(10, 15)} onChange={onChange} />
            </AdminUiProvider>
        );

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getAllByRole('spinbutton')[0]).toHaveTextContent('10');
    });

    it('types an hour', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderField(<TimeField aria-label="Время" value={new Time(10, 15)} onChange={onChange} />);

        const hour = screen.getAllByRole('spinbutton')[0];

        hour.focus();
        await user.keyboard('11');

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls.at(-1)?.[0].hour).toBe(11);
    });

    it('disables segments and marks the field invalid', () => {
        renderField(<TimeField aria-label="Время" disabled invalid dataTestId="time" />);

        screen.getAllByRole('spinbutton').forEach(segment => {
            expect(segment).toHaveAttribute('aria-disabled', 'true');
        });

        expect(screen.getByTestId('time')).toHaveAttribute('data-invalid', 'true');
    });

    it('does not mark the field invalid by default', () => {
        renderField(<TimeField aria-label="Время" dataTestId="time" />);

        expect(screen.getByTestId('time')).not.toHaveAttribute('data-invalid');
    });

    it('adds a day-period segment for a 12-hour cycle', () => {
        const { unmount } = renderField(<TimeField aria-label="Время" hourCycle={24} value={new Time(14, 30)} />);
        const hour24Count = screen.getAllByRole('spinbutton').length;

        unmount();
        renderField(<TimeField aria-label="Время" hourCycle={12} value={new Time(14, 30)} />);

        expect(screen.getAllByRole('spinbutton')).toHaveLength(hour24Count + 1);
    });

    it('does not accept hour 25 or minute 99', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderField(<TimeField aria-label="Время" value={new Time(10, 15)} onChange={onChange} />);

        const [hour, minute] = screen.getAllByRole('spinbutton');
        hour.focus();
        await user.keyboard('25');
        expect(onChange.mock.calls.some(call => call[0]?.hour === 25)).toBe(false);

        minute.focus();
        await user.keyboard('99');
        expect(onChange.mock.calls.some(call => call[0]?.minute === 99)).toBe(false);
    });

    it('steps the hour with ArrowUp and stops at minValue', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderField(
            <TimeField aria-label="Время" value={new Time(9, 0)} minValue={new Time(9, 0)} onChange={onChange} />
        );

        const hour = screen.getAllByRole('spinbutton')[0]!;
        hour.focus();
        await user.keyboard('{ArrowUp}');
        expect(onChange.mock.calls.at(-1)?.[0].hour).toBe(10);

        await user.keyboard('{ArrowDown}{ArrowDown}');
        await user.tab();
        expect(Number(screen.getAllByRole('spinbutton')[0]?.textContent)).toBeGreaterThanOrEqual(9);
    });

    it('restores the previous time on blur when the hour is cleared', async () => {
        const user = userEvent.setup();

        renderField(
            <>
                <TimeField aria-label="Время" defaultValue={new Time(14, 30)} />
                <button type="button">out</button>
            </>
        );

        const hour = screen.getAllByRole('spinbutton')[0]!;
        hour.focus();
        await user.keyboard('{Backspace}{Backspace}');
        await user.click(screen.getByRole('button', { name: 'out' }));

        expect(screen.getAllByRole('spinbutton')[0]).toHaveTextContent('14');
    });

    it('keeps a typed 12-hour time on blur', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderField(
            <>
                <TimeField aria-label="Время" hourCycle={12} defaultValue={new Time(14, 30)} onChange={onChange} />
                <button type="button">out</button>
            </>
        );

        const hour = screen.getAllByRole('spinbutton')[0]!;
        hour.focus();
        await user.keyboard('3');
        await user.click(screen.getByRole('button', { name: 'out' }));

        expect(onChange.mock.calls.at(-1)?.[0].hour).toBe(15);
        expect(screen.getAllByRole('spinbutton')[0]).not.toHaveTextContent('02');
    });

    it('restores the previous time on blur when the minutes are cleared', async () => {
        const user = userEvent.setup();

        renderField(
            <>
                <TimeField aria-label="Время" defaultValue={new Time(14, 30)} />
                <button type="button">out</button>
            </>
        );

        const minute = screen.getAllByRole('spinbutton')[1]!;
        minute.focus();
        await user.keyboard('{Backspace}{Backspace}');
        await user.click(screen.getByRole('button', { name: 'out' }));

        expect(screen.getAllByRole('spinbutton')[1]).toHaveTextContent('30');
    });

    it('restores seconds on blur when the second segment is cleared', async () => {
        const user = userEvent.setup();

        renderField(
            <>
                <TimeField aria-label="Время" granularity="second" defaultValue={new Time(14, 30, 45)} />
                <button type="button">out</button>
            </>
        );

        const second = screen.getAllByRole('spinbutton')[2]!;
        second.focus();
        await user.keyboard('{Backspace}{Backspace}');
        await user.click(screen.getByRole('button', { name: 'out' }));

        expect(screen.getAllByRole('spinbutton')[2]).toHaveTextContent('45');
    });

    it('restores the focused time when the hour is cleared after an external update', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [value, setValue] = useState<TimeValue | null>(new Time(10, 0));

            return (
                <>
                    <button type="button" onClick={() => setValue(new Time(18, 30))}>
                        shift
                    </button>
                    <TimeField aria-label="Время" value={value} onChange={setValue} />
                    <button type="button">out</button>
                </>
            );
        };

        renderField(<Harness />);

        await user.click(screen.getByRole('button', { name: 'shift' }));
        expect(screen.getAllByRole('spinbutton')[0]).toHaveTextContent('18');

        const hour = screen.getAllByRole('spinbutton')[0]!;
        hour.focus();
        await user.keyboard('{Backspace}{Backspace}');
        await user.click(screen.getByRole('button', { name: 'out' }));

        expect(screen.getAllByRole('spinbutton')[0]).toHaveTextContent('18');
        expect(screen.getAllByRole('spinbutton')[1]).toHaveTextContent('30');
    });

    it('uses the sm size and primary variant classes', () => {
        renderField(<TimeField aria-label="Время" size="sm" variant="primary" block={false} dataTestId="time" />);

        const hour = screen.getAllByRole('spinbutton')[0]!;

        expect(hour.closest(`.${styles.sm}`)).toHaveClass(styles.primary);
        expect(screen.getByTestId('time')).not.toHaveClass(styles.block);
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = renderField(<TimeField aria-label="Время" />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = renderField(<TimeField aria-label="Время" disabled />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = renderField(<TimeField aria-label="Время" invalid />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
