import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { NumberInput } from '..';

import styles from '../styles.module.css';

describe('NumberInput', () => {
    it('keeps a read-only value focusable and unchanged', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" value={4} readOnly onChange={onChange} dataTestId="qty" />);

        const input = screen.getByRole('textbox', { name: 'Qty' });

        expect(input).toHaveAttribute('readonly');
        expect(input).not.toBeDisabled();
        expect(screen.getByTestId('qty')).toHaveAttribute('data-readonly', 'true');

        await user.click(input);
        await user.type(input, '9');

        expect(onChange).not.toHaveBeenCalled();
    });

    it('hides the clear button when read-only', () => {
        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <NumberInput aria-label="Qty" value={4} readOnly clear />
            </AdminUiProvider>
        );

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });

    it('renders textbox', () => {
        render(<NumberInput aria-label="Qty" dataTestId="qty" />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByTestId('qty')).toBeInTheDocument();
    });

    it('applies block class by default', () => {
        render(<NumberInput aria-label="Qty" dataTestId="qty" />);

        expect(screen.getByTestId('qty')).toHaveClass(styles.block);
    });

    it('omits block class when block={false}', () => {
        render(<NumberInput aria-label="Qty" dataTestId="qty" block={false} />);

        expect(screen.getByTestId('qty')).not.toHaveClass(styles.block);
    });

    it('follows value and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(<NumberInput aria-label="Qty" value={1} onChange={onChange} />);

        rerender(<NumberInput aria-label="Qty" value={2} onChange={onChange} />);

        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveValue('2');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('calls onChange with number', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.type(input, '12');
        await user.tab();

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls.at(-1)?.[0]).toBe(12);
    });

    it('renders suffix', () => {
        render(<NumberInput aria-label="Price" suffix="₽" />);

        expect(screen.getByText('₽')).toBeInTheDocument();
    });

    it('disables input when disabled', () => {
        render(<NumberInput aria-label="Qty" disabled />);

        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('sets invalid state', () => {
        render(<NumberInput aria-label="Qty" invalid />);

        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('clears value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <NumberInput aria-label="Qty" value={12} clear onChange={onChange} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('clears uncontrolled value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <NumberInput aria-label="Qty" defaultValue={12} clear onChange={onChange} />
            </AdminUiProvider>
        );

        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveValue('12');

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith(null);
        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveValue('');
    });

    it('treats NaN defaultValue as empty uncontrolled state', () => {
        render(<NumberInput aria-label="Qty" defaultValue={Number.NaN} />);

        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveValue('');
    });

    it('renders prefix', () => {
        render(<NumberInput aria-label="Price" prefix="$" />);

        expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('emits null when input is cleared via typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" defaultValue={5} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.clear(input);
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toBeNull();
    });

    it('clamps a typed value to max on blur', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" min={0} max={10} defaultValue={1} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.clear(input);
        await user.type(input, '25');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toBe(10);
        expect(input).toHaveValue('10');
    });

    it('does not step below min with ArrowDown', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" min={0} max={10} defaultValue={0} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.click(input);
        await user.keyboard('{ArrowDown}');

        expect(onChange.mock.calls.at(-1)?.[0] ?? 0).toBeGreaterThanOrEqual(0);
        expect(input).toHaveValue('0');
    });

    it('steps with ArrowUp and ignores letters', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" min={0} max={10} step={2} defaultValue={2} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.click(input);
        await user.keyboard('{ArrowUp}');
        expect(onChange.mock.calls.at(-1)?.[0]).toBe(4);

        await user.keyboard('{PageUp}');
        const afterPageUp = onChange.mock.calls.at(-1)?.[0] as number;
        expect(afterPageUp).toBeGreaterThan(4);
        expect(afterPageUp).toBeLessThanOrEqual(10);

        await user.keyboard('{PageDown}');
        const afterPageDown = onChange.mock.calls.at(-1)?.[0] as number;
        expect(afterPageDown).toBeLessThan(afterPageUp);
        expect(afterPageDown).toBeGreaterThanOrEqual(0);

        await user.type(input, 'abc');
        const numeric = onChange.mock.calls.every(call => call[0] == null || typeof call[0] === 'number');
        expect(numeric).toBe(true);
    });

    it('accepts zero, a negative value, and a pasted number', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" defaultValue={null} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.click(input);
        await user.keyboard('0');
        await user.tab();
        expect(onChange.mock.calls.at(-1)?.[0]).toBe(0);

        await user.click(input);
        await user.clear(input);
        await user.keyboard('-3');
        await user.tab();
        expect(onChange.mock.calls.at(-1)?.[0]).toBe(-3);

        await user.click(input);
        await user.clear(input);
        await user.paste('12');
        await user.tab();
        expect(onChange.mock.calls.at(-1)?.[0]).toBe(12);
    });

    it('parses a ru-RU decimal comma', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider locale="ru-RU">
                <NumberInput aria-label="Qty" formatOptions={{ maximumFractionDigits: 2 }} onChange={onChange} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.click(input);
        await user.keyboard('1,5');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toBe(1.5);
    });

    it('calls onBlur when the field loses focus', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(<NumberInput aria-label="Qty" onBlur={onBlur} />);

        await user.click(screen.getByRole('textbox', { name: 'Qty' }));
        await user.tab();

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('shows the placeholder', () => {
        render(<NumberInput aria-label="Qty" placeholder="0" />);

        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveAttribute('placeholder', '0');
    });

    it('uses the sm size and primary variant classes', () => {
        render(<NumberInput aria-label="Qty" size="sm" variant="primary" dataTestId="qty" />);

        const shell = screen.getByTestId('qty');

        expect(shell).toHaveClass(styles.sm);
        expect(shell).toHaveClass(styles.primary);
        expect(screen.getByRole('textbox', { name: 'Qty' })).toBeEnabled();
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(<NumberInput aria-label="Qty" />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(<NumberInput aria-label="Qty" disabled value={1} />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(<NumberInput aria-label="Qty" invalid value={1} />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
