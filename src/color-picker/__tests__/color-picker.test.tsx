import { type ComponentProps, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ColorPicker } from '..';

const Harness = ({
    initial = '',
    onChange,
    onPreview,
    ...props
}: {
    initial?: string;
    onChange?: (value: string) => void;
    onPreview?: (value: string) => void;
} & Omit<ComponentProps<typeof ColorPicker>, 'value' | 'onChange' | 'onPreview'>) => {
    const [value, setValue] = useState(initial);

    return (
        <ColorPicker
            {...props}
            value={value}
            onPreview={onPreview}
            onChange={next => {
                onChange?.(next);
                setValue(next);
            }}
        />
    );
};

const areaRect = {
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
} as DOMRect;

describe('ColorPicker', () => {
    it('does not publish a color while the value is empty', () => {
        const onChange = vi.fn();

        render(<ColorPicker value="" onChange={onChange} />);

        expect(screen.getByRole('slider', { name: 'Оттенок' })).toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('commits a keyboard step on the hue slider', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial="#ff0000" onChange={onChange} />);

        const hue = screen.getByRole('slider', { name: 'Оттенок' });
        hue.focus();
        await user.keyboard('{ArrowRight}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toMatch(/^#[0-9a-f]{6}$/);
        expect(onChange.mock.calls[0][0]).not.toBe('#ff0000');
    });

    it('keeps the hue position while the color is gray', async () => {
        const user = userEvent.setup();

        render(<Harness initial="" />);

        const hue = screen.getByRole('slider', { name: 'Оттенок' });
        hue.focus();
        await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');

        expect(hue).toHaveValue('3');
    });

    it('restores a gray hue passed from outside', () => {
        render(<ColorPicker value="" hue={3} />);

        expect(screen.getByRole('slider', { name: 'Оттенок' })).toHaveValue('3');
    });

    it('publishes a preset again after the parent replaces the value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const Parent = () => {
            const [value, setValue] = useState('#0000ff');

            return (
                <>
                    <ColorPicker
                        value={value}
                        presets={['#00ff00']}
                        onChange={next => {
                            onChange(next);
                            setValue(next);
                        }}
                    />
                    <button type="button" onClick={() => setValue('#ff0000')}>
                        Replace
                    </button>
                </>
            );
        };

        render(<Parent />);
        await user.click(screen.getByTestId('color-picker-preset-#00ff00'));
        expect(onChange).toHaveBeenCalledTimes(1);

        await user.click(screen.getByRole('button', { name: 'Replace' }));
        await user.click(screen.getByTestId('color-picker-preset-#00ff00'));

        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith('#00ff00');
    });

    it('commits a preset immediately and drops strings that are not colors', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial="#000000" presets={['#00ff00', 'nope']} onChange={onChange} />);

        expect(screen.queryByTestId('color-picker-preset-nope')).not.toBeInTheDocument();
        await user.click(screen.getByTestId('color-picker-preset-#00ff00'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('#00ff00');
    });

    it('does not render a preset row when every preset is invalid', () => {
        render(<ColorPicker value="#000000" presets={['nope']} />);

        expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('previews the area while dragging and publishes once on release', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onPreview = vi.fn();

        render(<Harness initial="#ff0000" onChange={onChange} onPreview={onPreview} />);

        const area = screen.getByTestId('color-picker-area');
        area.getBoundingClientRect = () => areaRect;

        await user.pointer([
            { keys: '[MouseLeft>]', target: area, coords: { x: 10, y: 10 } },
            { target: area, coords: { x: 80, y: 20 } },
            { target: area, coords: { x: 40, y: 70 } },
            { keys: '[/MouseLeft]', target: area, coords: { x: 40, y: 70 } },
        ]);

        expect(onPreview).toHaveBeenCalled();
        expect(onPreview.mock.calls[0][0]).toMatch(/^#[0-9a-f]{6}$/);
        expect(onPreview.mock.invocationCallOrder[0]).toBeLessThan(onChange.mock.invocationCallOrder[0]);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toMatch(/^#[0-9a-f]{6}$/);
        expect(onChange.mock.calls[0][0]).not.toBe('#ff0000');
    });

    it('forwards ref to the palette root', () => {
        const ref = { current: null as HTMLDivElement | null };

        render(<ColorPicker value="#ff0000" ref={ref} dataTestId="palette" />);

        expect(ref.current).toBe(screen.getByTestId('palette'));
    });

    it('names the palette when aria-label is set', () => {
        render(<ColorPicker value="#ff0000" aria-label="Brand" />);

        expect(screen.getByRole('group', { name: 'Brand' })).toBeInTheDocument();
    });

    it('keeps defaultValue without external state', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ColorPicker defaultValue="#000000" presets={['#00ff00']} onChange={onChange} />);

        const hue = screen.getByRole('slider', { name: 'Оттенок' });
        const before = (hue as HTMLInputElement).value;

        await user.click(screen.getByTestId('color-picker-preset-#00ff00'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('#00ff00');
        expect((hue as HTMLInputElement).value).not.toBe(before);
    });

    it('does not move a disabled palette', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<ColorPicker value="#ff0000" disabled onChange={onChange} />);

        const hue = screen.getByRole('slider', { name: 'Оттенок' });
        const before = hue.getAttribute('aria-valuenow');

        hue.focus();
        await user.keyboard('{ArrowRight}');

        expect(onChange).not.toHaveBeenCalled();
        expect(hue.getAttribute('aria-valuenow')).toBe(before);
    });
});
