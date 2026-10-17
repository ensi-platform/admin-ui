import { createRef, useState } from 'react';

import { render, screen } from '@testing-library/react';
import { render as renderBare } from '@testing-library/react/pure';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import numberInputStyles from '@/number-input/styles.module.css';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { NumberRange } from '..';
import { type INumberRangeValue } from '../types';

import styles from '../styles.module.css';

const Harness = ({
    initial,
    clear,
    onChange,
}: {
    initial: INumberRangeValue;
    clear?: boolean;
    onChange: (value: INumberRangeValue) => void;
}) => {
    const [value, setValue] = useState(initial);

    return (
        <NumberRange
            fromLabel="From"
            toLabel="To"
            clear={clear}
            value={value}
            onChange={next => {
                onChange(next);
                setValue(next);
            }}
        />
    );
};

describe('NumberRange', () => {
    it('renders two inputs with default size md and dataTestId', () => {
        render(<NumberRange fromLabel="From" toLabel="To" dataTestId="range" />);

        const inputs = screen.getAllByRole('textbox');

        expect(inputs).toHaveLength(2);
        expect(screen.getByRole('textbox', { name: 'From' }).closest(`.${numberInputStyles.md}`)).toBeTruthy();
        expect(screen.getByRole('textbox', { name: 'To' }).closest(`.${numberInputStyles.md}`)).toBeTruthy();
        expect(screen.getByTestId('range')).toBeInTheDocument();
    });

    it('does not touch the other side when one side is empty', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial={{ from: null, to: 10 }} onChange={onChange} />);

        await user.type(screen.getByRole('textbox', { name: 'From' }), '4');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 4, to: 10 });
    });

    it('pulls to when from is greater than to', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial={{ from: 1, to: 5 }} onChange={onChange} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '8');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 8, to: 8 });
    });

    it('pulls from when to is less than from', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial={{ from: 8, to: 10 }} onChange={onChange} />);

        const to = screen.getByRole('textbox', { name: 'To' });
        await user.clear(to);
        await user.type(to, '3');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 3, to: 3 });
    });

    it('sets null only on the changed side when cleared', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <Harness initial={{ from: 1, to: 5 }} clear onChange={onChange} />
            </AdminUiProvider>
        );

        const [clearFrom] = screen.getAllByRole('button', { name: 'Clear' });
        await user.click(clearFrom);

        expect(onChange).toHaveBeenCalledWith({ from: null, to: 5 });
    });

    it('does not change either side when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberRange fromLabel="From" toLabel="To" disabled value={{ from: 1, to: 2 }} onChange={onChange} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        const to = screen.getByRole('textbox', { name: 'To' });

        expect(from).toBeDisabled();
        expect(to).toBeDisabled();

        await user.type(from, '9');
        await user.type(to, '9');

        expect(onChange).not.toHaveBeenCalled();
        expect(from).toHaveValue('1');
        expect(to).toHaveValue('2');
    });

    it('marks both fields invalid', () => {
        render(<NumberRange fromLabel="From" toLabel="To" invalid value={{ from: 1, to: 2 }} />);

        expect(screen.getByRole('textbox', { name: 'From' })).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not stretch the fields when block is off', () => {
        render(<NumberRange fromLabel="From" toLabel="To" block={false} dataTestId="range" />);

        expect(screen.getByTestId('range')).not.toHaveClass(styles.block);
    });

    it('stores an uncontrolled draft', async () => {
        const user = userEvent.setup();

        render(<NumberRange fromLabel="From" toLabel="To" defaultValue={{ from: 1, to: null }} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '6');
        await user.tab();

        expect(from).toHaveValue('6');
    });

    it('aligns to when an uncontrolled from exceeds it', async () => {
        const user = userEvent.setup();

        render(<NumberRange fromLabel="From" toLabel="To" defaultValue={{ from: 1, to: 5 }} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '8');
        await user.tab();

        expect(from).toHaveValue('8');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('8');
    });

    it('keeps to when from is set equal to to', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial={{ from: 1, to: 10 }} onChange={onChange} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '10');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 10, to: 10 });
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('10');
    });

    it('clamps a typed side to max and does not go below min', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <NumberRange
                fromLabel="From"
                toLabel="To"
                min={0}
                max={10}
                defaultValue={{ from: 1, to: 2 }}
                onChange={onChange}
            />
        );

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '25');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 10, to: 10 });
        expect(from).toHaveValue('10');

        const to = screen.getByRole('textbox', { name: 'To' });
        await user.click(to);
        await user.clear(to);
        await user.paste('-3');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0].to).toBe(0);
        expect(to).toHaveValue('0');
    });

    it('steps the focused side with ArrowUp and leaves the other side', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <NumberRange fromLabel="From" toLabel="To" step={2} defaultValue={{ from: 2, to: 8 }} onChange={onChange} />
        );

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.click(from);
        await user.keyboard('{ArrowUp}');

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 4, to: 8 });
        expect(from).toHaveValue('4');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('8');
    });

    it('shows a ru-RU decimal from formatOptions', () => {
        render(
            <AdminUiProvider locale="ru-RU">
                <NumberRange
                    fromLabel="From"
                    toLabel="To"
                    formatOptions={{ maximumFractionDigits: 2, minimumFractionDigits: 1 }}
                    value={{ from: 1.5, to: 2 }}
                />
            </AdminUiProvider>
        );

        expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('1,5');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('2,0');
    });

    it('leaves the side unchanged when non-numeric text is pasted', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberRange fromLabel="From" toLabel="To" defaultValue={{ from: 4, to: 6 }} onChange={onChange} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.click(from);
        await user.paste('abc');
        await user.tab();

        expect(from).toHaveValue('4');
        expect(onChange.mock.calls.every(call => call[0].from == null || typeof call[0].from === 'number')).toBe(true);

        await user.click(from);
        await user.clear(from);
        await user.paste('5');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 5, to: 6 });
    });

    it('calls onBlur when a side loses focus', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(<NumberRange fromLabel="From" toLabel="To" onBlur={onBlur} />);

        await user.click(screen.getByRole('textbox', { name: 'From' }));
        await user.tab();

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('shows a placeholder and described-by on each side', () => {
        render(
            <NumberRange
                fromLabel="From"
                toLabel="To"
                fromPlaceholder="Min"
                toPlaceholder="Max"
                aria-describedby="hint"
            />
        );

        expect(screen.getByRole('textbox', { name: 'From' })).toHaveAttribute('placeholder', 'Min');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveAttribute('placeholder', 'Max');
        expect(screen.getByRole('textbox', { name: 'From' })).toHaveAttribute('aria-describedby', 'hint');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveAttribute('aria-describedby', 'hint');
    });

    it('keeps the controlled range when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(<NumberRange fromLabel="From" toLabel="To" value={{ from: 1, to: 2 }} onChange={() => undefined} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '9');
        await user.tab();

        expect(from).toHaveValue('1');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('2');
    });

    it('uses the sm size class on both fields', () => {
        render(<NumberRange fromLabel="From" toLabel="To" size="sm" variant="primary" />);

        expect(screen.getByRole('textbox', { name: 'From' }).closest(`.${numberInputStyles.sm}`)).toHaveClass(
            numberInputStyles.primary
        );
        expect(screen.getByRole('textbox', { name: 'To' }).closest(`.${numberInputStyles.sm}`)).toHaveClass(
            numberInputStyles.primary
        );
    });

    it('points ref at the range element', () => {
        const ref = createRef<HTMLDivElement>();

        render(<NumberRange ref={ref} fromLabel="From" toLabel="To" dataTestId="range" />);

        expect(ref.current).toBe(screen.getByTestId('range'));
    });

    it('renders both sides without AdminUiProvider', () => {
        renderBare(<NumberRange fromLabel="From" toLabel="To" defaultValue={{ from: 1, to: 2 }} />);

        expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('1');
        expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('2');
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(<NumberRange fromLabel="From" toLabel="To" />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(<NumberRange fromLabel="From" toLabel="To" disabled value={{ from: 1, to: 2 }} />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(<NumberRange fromLabel="From" toLabel="To" invalid value={{ from: 1, to: 2 }} />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
