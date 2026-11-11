import { type ComponentProps, type FormEvent, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { axe } from '@/test/axe';

import { ColorField } from '..';

const Harness = ({
    initial = '',
    onChange,
    ...props
}: {
    initial?: string;
    onChange?: (value: string) => void;
} & Omit<ComponentProps<typeof ColorField>, 'value' | 'onChange'>) => {
    const [value, setValue] = useState(initial);

    return (
        <ColorField
            {...props}
            value={value}
            onChange={next => {
                onChange?.(next);
                setValue(next);
            }}
        />
    );
};

const hexInput = () => screen.getByRole('textbox', { name: 'Код цвета' });

const openPalette = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('button', { name: 'Открыть палитру' }));
};

describe('ColorField', () => {
    it('keeps an empty field empty and does not publish black', () => {
        const onChange = vi.fn();

        render(<ColorField value="" onChange={onChange} />);

        expect(hexInput()).toHaveValue('');
        expect(hexInput()).toHaveAttribute('placeholder', '#RRGGBB');
        expect(screen.getByTestId('color-field-trigger')).toHaveAttribute('data-empty', 'true');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('shows a short stored hex without writing it back', () => {
        const onChange = vi.fn();

        render(<ColorField value="#FFF" onChange={onChange} />);

        expect(hexInput()).toHaveValue('#ffffff');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('shows an unknown stored value as an empty invalid field', () => {
        const onChange = vi.fn();

        render(<ColorField value="red" onChange={onChange} dataTestId="color" />);

        expect(hexInput()).toHaveValue('');
        expect(screen.getByTestId('color')).toHaveAttribute('data-invalid', 'true');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('publishes six digits once and does not expand a three-digit prefix while typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness onChange={onChange} />);
        await user.type(hexInput(), '#abcdef');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('#abcdef');
        expect(hexInput()).toHaveValue('#abcdef');
    });

    it('keeps the typed case while typing and lowercases on blur', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness onChange={onChange} />);
        await user.type(hexInput(), '#ABCDEF');

        expect(onChange).toHaveBeenCalledWith('#abcdef');
        expect(hexInput()).toHaveValue('#ABCDEF');

        await user.tab();
        expect(hexInput()).toHaveValue('#abcdef');
    });

    it('falls back to the parent value when the parent rejects the change', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ColorField value="#ff0000" onChange={onChange} />);
        await user.clear(hexInput());
        await user.type(hexInput(), '#00ff00');
        expect(onChange).toHaveBeenCalledWith('#00ff00');

        await user.tab();
        expect(hexInput()).toHaveValue('#ff0000');
    });

    it('forwards inputRef to the hex input', () => {
        const inputRef = { current: null as HTMLInputElement | null };

        render(<ColorField value="" inputRef={inputRef} />);

        expect(inputRef.current).toBe(hexInput());
    });

    it('expands a three-digit hex on blur', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness onChange={onChange} />);
        await user.type(hexInput(), '#abc');
        expect(onChange).not.toHaveBeenCalled();

        await user.tab();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('#aabbcc');
    });

    it('applies Enter inside a form without submitting it', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
        const onChange = vi.fn();

        render(
            <form onSubmit={onSubmit}>
                <Harness onChange={onChange} />
                <button type="submit">Save</button>
            </form>
        );

        await user.type(hexInput(), '#abc{Enter}');

        expect(onSubmit).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith('#aabbcc');

        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('normalizes a pasted rgb() value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness onChange={onChange} />);
        await user.click(hexInput());
        await user.paste('rgb(255, 0, 0)');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('#ff0000');
    });

    it('restores the last color when a partial hex is blurred', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial="#ff0000" onChange={onChange} />);
        await user.clear(hexInput());
        await user.type(hexInput(), '#12');
        await user.tab();

        expect(hexInput()).toHaveValue('#ff0000');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('clears the color', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial="#ff0000" clear onChange={onChange} />);
        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith('');
        expect(hexInput()).toHaveValue('');
        expect(screen.getByTestId('color-field-trigger')).toHaveAttribute('data-empty', 'true');
    });

    it('does not edit a disabled field', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ColorField value="#ff0000" disabled clear onChange={onChange} />);

        expect(screen.getByTestId('color-field-trigger')).toBeDisabled();
        expect(hexInput()).toBeDisabled();
        expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument();
        await user.click(hexInput());
        expect(onChange).not.toHaveBeenCalled();
    });

    it('shows defaultValue without external state', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ColorField defaultValue="#ff0000" onChange={onChange} />);

        expect(hexInput()).toHaveValue('#ff0000');
        expect(onChange).not.toHaveBeenCalled();

        await user.clear(hexInput());
        await user.type(hexInput(), '#00ff00');

        expect(hexInput()).toHaveValue('#00ff00');
        expect(onChange).toHaveBeenCalledWith('#00ff00');
    });

    it('opens the panel and closes it with Escape', async () => {
        const user = userEvent.setup();

        render(<Harness initial="#ff0000" />);
        await openPalette(user);
        expect(screen.getByTestId('color-field-dialog')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(screen.queryByTestId('color-field-dialog')).not.toBeInTheDocument();
    });

    it('names the palette dialog', async () => {
        const user = userEvent.setup();

        render(<Harness initial="#ff0000" />);
        await openPalette(user);

        expect(screen.getByRole('dialog', { name: 'Палитра цветов' })).toBeInTheDocument();
    });

    it('calls onBlur when the panel closes', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(<Harness initial="#ff0000" onBlur={onBlur} />);
        await openPalette(user);
        expect(onBlur).not.toHaveBeenCalled();

        await user.keyboard('{Escape}');
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('writes a preset into the field', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial="#000000" presets={['#00ff00', 'nope']} onChange={onChange} />);
        await openPalette(user);
        expect(screen.queryByTestId('color-picker-preset-nope')).not.toBeInTheDocument();
        await user.click(screen.getByTestId('color-picker-preset-#00ff00'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('#00ff00');

        await user.keyboard('{Escape}');
        expect(hexInput()).toHaveValue('#00ff00');
    });

    it('keeps a gray hue after the panel closes', async () => {
        const user = userEvent.setup();

        render(<Harness initial="" />);
        await openPalette(user);

        const hue = screen.getByRole('slider', { name: 'Оттенок' });
        hue.focus();
        await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
        expect(hue).toHaveValue('3');

        await user.keyboard('{Escape}');
        await openPalette(user);

        expect(screen.getByRole('slider', { name: 'Оттенок' })).toHaveValue('3');
    });

    it('previews a drag in the field and publishes it on release', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial="#ff0000" onChange={onChange} />);
        await openPalette(user);

        const area = screen.getByTestId('color-picker-area');
        area.getBoundingClientRect = () =>
            ({
                x: 0,
                y: 0,
                left: 0,
                top: 0,
                width: 100,
                height: 100,
                right: 100,
                bottom: 100,
                toJSON() {
                    return {};
                },
            }) as DOMRect;

        const fieldHex = () => screen.getByRole('textbox', { name: 'Код цвета', hidden: true }) as HTMLInputElement;

        await user.pointer([
            { keys: '[MouseLeft>]', target: area, coords: { x: 10, y: 10 } },
            { target: area, coords: { x: 80, y: 20 } },
        ]);

        expect(onChange).not.toHaveBeenCalled();
        expect(fieldHex().value).toMatch(/^#[0-9a-f]{6}$/);
        expect(fieldHex()).not.toHaveValue('#ff0000');

        await user.pointer([{ keys: '[/MouseLeft]', target: area, coords: { x: 80, y: 20 } }]);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('has no axe violations', async () => {
        const { container } = render(<ColorField aria-label="Color" />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
