import { createRef, useState, type ChangeEvent } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { Mask } from '..';

const phoneOpts = { mask: '+7 (000) 000-00-00' };
const digitOpts = { mask: '000' };

const ControlledMask = ({
    initial,
    opts,
    onChange,
    clear = false,
}: {
    initial: string;
    opts: typeof phoneOpts;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    clear?: boolean;
}) => {
    const [value, setValue] = useState(initial);

    return (
        <Mask
            aria-label="Phone"
            opts={opts}
            value={value}
            clear={clear}
            onChange={event => {
                onChange(event);
                setValue(event.currentTarget.value);
            }}
        />
    );
};

const lastValue = (onChange: ReturnType<typeof vi.fn>) => onChange.mock.calls.at(-1)?.[0].currentTarget.value as string;

describe('Mask', () => {
    it('formats typed digits with the mask literals', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Mask aria-label="Phone" opts={phoneOpts} onChange={onChange} />);

        await user.type(screen.getByRole('textbox', { name: 'Phone' }), '9991234567');

        expect(lastValue(onChange)).toBe('+7 (999) 123-45-67');
        expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('+7 (999) 123-45-67');
    });

    it('emits a partial mask before the pattern is complete', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Mask aria-label="Phone" opts={phoneOpts} onChange={onChange} />);

        await user.type(screen.getByRole('textbox', { name: 'Phone' }), '999');

        expect(lastValue(onChange)).toBe('+7 (999');
        expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('+7 (999');
    });

    it('stays empty until the user types', () => {
        const onChange = vi.fn();

        render(<Mask aria-label="Phone" opts={phoneOpts} onChange={onChange} />);

        expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('follows value and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Mask aria-label="Phone" opts={phoneOpts} value="+7 (999" onChange={onChange} />);

        rerender(<Mask aria-label="Phone" opts={phoneOpts} value="+7 (999) 123-45-67" onChange={onChange} />);

        expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('+7 (999) 123-45-67');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('clears the masked value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <Mask aria-label="Phone" opts={phoneOpts} clear onChange={onChange} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('textbox', { name: 'Phone' });

        await user.type(input, '9991234567');
        await user.click(screen.getByRole('button', { name: 'Clear' }));

        expect(lastValue(onChange)).toBe('');
        expect(input).toHaveValue('');
    });

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Mask aria-label="Phone" opts={phoneOpts} disabled value="+7 (999) 123-45-67" onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Phone' });

        expect(input).toBeDisabled();
        await user.type(input, '1');

        expect(onChange).not.toHaveBeenCalled();
        expect(input).toHaveValue('+7 (999) 123-45-67');
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Mask aria-label="Phone" opts={phoneOpts} dataTestId="phone-mask" />);

        expect(screen.getByTestId('phone-mask')).toBeInTheDocument();
    });

    it('emits a digit after an external value the mask rejects', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ControlledMask initial="abc" opts={digitOpts} onChange={onChange} />);

        onChange.mockClear();
        await user.type(screen.getByRole('textbox', { name: 'Phone' }), '1');

        expect(onChange).toHaveBeenCalled();
        expect(lastValue(onChange)).toBe('1');
    });

    it('normalizes an external raw value once', () => {
        const onChange = vi.fn();

        render(<ControlledMask initial="+79991234567" opts={phoneOpts} onChange={onChange} />);

        expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('+7 (999) 123-45-67');
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(lastValue(onChange)).toBe('+7 (999) 123-45-67');
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(<Mask aria-label="Phone" opts={phoneOpts} value="" onChange={() => undefined} />);

        const input = screen.getByRole('textbox', { name: 'Phone' });
        await user.type(input, '9');

        expect(input).toHaveValue('');
    });

    it('emits an empty value once when the user deletes the mask', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ControlledMask initial="" opts={phoneOpts} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Phone' });
        await user.type(input, '9');
        onChange.mockClear();
        await user.keyboard('{Backspace>6}');

        const emptiedByKey = onChange.mock.calls.filter(call => call[0].currentTarget.value === '');

        expect(emptiedByKey).toHaveLength(1);
        expect(input).toHaveValue('');

        await user.type(input, '9');
        onChange.mockClear();
        await user.clear(input);

        const emptiedByClear = onChange.mock.calls.filter(call => call[0].currentTarget.value === '');

        expect(emptiedByClear).toHaveLength(1);
        expect(input).toHaveValue('');
    });

    it('emits an empty value once when clear is clicked and keeps focus', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <ControlledMask initial="+7 (999) 123-45-67" opts={phoneOpts} clear onChange={onChange} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('textbox', { name: 'Phone' });
        await user.click(input);
        onChange.mockClear();
        await user.click(screen.getByRole('button', { name: 'Clear' }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(lastValue(onChange)).toBe('');
        expect(input).toHaveValue('');
        expect(input).toHaveFocus();
    });

    it('formats a pasted number', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ControlledMask initial="" opts={phoneOpts} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Phone' });
        await user.click(input);
        await user.paste('9991234567');

        expect(input).toHaveValue('+7 (999) 123-45-67');
        expect(lastValue(onChange)).toBe('+7 (999) 123-45-67');
    });

    it('formats defaultValue without calling onChange', () => {
        const onChange = vi.fn();

        render(<Mask aria-label="Phone" opts={phoneOpts} defaultValue="+79991234567" onChange={onChange} />);

        expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('+7 (999) 123-45-67');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('keeps a read-only value unchanged and hides clear', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <Mask
                    aria-label="Phone"
                    opts={phoneOpts}
                    value="+7 (999) 123-45-67"
                    readOnly
                    clear
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        const input = screen.getByRole('textbox', { name: 'Phone' });

        expect(input).toHaveAttribute('readonly');
        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();

        await user.type(input, '1');

        expect(onChange).not.toHaveBeenCalled();
        expect(input).toHaveValue('+7 (999) 123-45-67');
    });

    it('does not loop when opts is a new object on every render', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const Inline = () => {
            const [value, setValue] = useState('');

            return (
                <Mask
                    aria-label="Phone"
                    opts={{ mask: '000' }}
                    value={value}
                    onChange={event => {
                        onChange(event);
                        setValue(event.currentTarget.value);
                    }}
                />
            );
        };

        render(<Inline />);

        const input = screen.getByRole('textbox', { name: 'Phone' });
        await user.type(input, '123');

        expect(input).toHaveValue('123');
        expect(onChange.mock.calls.length).toBeLessThanOrEqual(6);
        expect(lastValue(onChange)).toBe('123');
    });

    it('settles a mask that rewrites the value on every accept', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const upperOpts = { mask: /^[A-Z]*$/, prepare: (str: string) => str.toUpperCase() };

        render(<ControlledMask initial="abc" opts={upperOpts as unknown as typeof phoneOpts} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Phone' });
        expect(input).toHaveValue('ABC');

        onChange.mockClear();
        await user.type(input, 'd');

        expect(input).toHaveValue('ABCD');
        expect(onChange.mock.calls.length).toBeLessThanOrEqual(2);
    });

    it('assigns an object ref to the input', () => {
        const ref = createRef<HTMLInputElement>();

        render(<Mask aria-label="Phone" opts={phoneOpts} ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('has no axe violations', async () => {
        const { container } = render(<Mask aria-label="Phone" opts={phoneOpts} />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
