import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { axe } from '@/test/axe';

import { Slider } from '..';

import styles from '../styles.module.css';

describe('Slider', () => {
    it('renders a labelled slider and the current value', () => {
        render(<Slider aria-label="Scale" value={40} formatValue={value => `${value}%`} />);

        expect(screen.getByRole('slider', { name: 'Scale' })).toHaveValue('40');
        expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Slider aria-label="Scale" dataTestId="scale" />);

        expect(screen.getByTestId('scale')).toBeInTheDocument();
    });

    it('renders a tick for each step', () => {
        const { container } = render(<Slider aria-label="Scale" minValue={0} maxValue={100} step={25} />);

        expect(container.querySelectorAll(`.${styles.tick}`)).toHaveLength(5);
    });

    it('hides ticks when ticks is false', () => {
        const { container } = render(<Slider aria-label="Scale" ticks={false} />);

        expect(container.querySelectorAll(`.${styles.tick}`)).toHaveLength(0);
    });

    it('renders formatDetail next to the value', () => {
        render(<Slider aria-label="Scale" value={40} formatDetail={value => `${value} pts`} />);

        expect(screen.getByText('40 pts')).toBeInTheDocument();
    });

    it('assigns object and callback refs to the thumb input', () => {
        const objectRef = createRef<HTMLInputElement>();
        const callbackRef = vi.fn();

        const { rerender } = render(<Slider aria-label="Scale" ref={objectRef} />);

        expect(objectRef.current).toBeInstanceOf(HTMLInputElement);

        rerender(<Slider aria-label="Scale" ref={callbackRef} />);

        expect(callbackRef).toHaveBeenCalled();
        expect(callbackRef.mock.calls.at(-1)?.[0]).toBeInstanceOf(HTMLInputElement);
    });

    it('calls onChange when the value moves', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Slider aria-label="Scale" value={40} onChange={onChange} />);

        screen.getByRole('slider', { name: 'Scale' }).focus();
        await user.keyboard('{ArrowRight}');

        expect(onChange).toHaveBeenCalledWith(41);
    });

    it('jumps to the edges with Home and End and steps by page', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Slider aria-label="Scale" value={40} minValue={0} maxValue={100} step={1} onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'Scale' });
        slider.focus();
        await user.keyboard('{Home}');
        expect(onChange).toHaveBeenCalledWith(0);

        await user.keyboard('{End}');
        expect(onChange).toHaveBeenCalledWith(100);

        await user.keyboard('{PageDown}');
        expect(onChange.mock.calls.at(-1)?.[0]).toBeLessThan(100);
    });

    it('follows value and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Slider aria-label="Scale" value={40} onChange={onChange} />);

        rerender(<Slider aria-label="Scale" value={10} onChange={onChange} />);

        expect(screen.getByRole('slider', { name: 'Scale' })).toHaveValue('10');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Slider aria-label="Scale" disabled onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'Scale' });

        expect(slider).toBeDisabled();
        await user.click(slider);
        slider.focus();
        await user.keyboard('{ArrowRight}');

        expect(onChange).not.toHaveBeenCalled();
    });

    it('updates from defaultValue and steps with the keyboard', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Slider aria-label="Scale" defaultValue={40} minValue={0} maxValue={100} step={1} onChange={onChange} />
        );

        const slider = screen.getByRole('slider', { name: 'Scale' });

        expect(slider).toHaveValue('40');

        slider.focus();
        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(41);
        expect(slider).toHaveValue('41');

        await user.keyboard('{ArrowLeft}');
        expect(slider).toHaveValue('40');

        await user.keyboard('{ArrowUp}');
        expect(slider).toHaveValue('41');

        await user.keyboard('{ArrowDown}');
        expect(slider).toHaveValue('40');

        await user.keyboard('{PageUp}');
        expect(slider).toHaveValue('50');

        await user.keyboard('{PageDown}');
        expect(slider).toHaveValue('40');
    });

    it('clamps keyboard steps to min and max', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Slider aria-label="Scale" defaultValue={0} minValue={0} maxValue={10} step={5} onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'Scale' });
        slider.focus();
        await user.keyboard('{ArrowLeft}');

        expect(onChange).not.toHaveBeenCalled();
        expect(slider).toHaveValue('0');

        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenCalledWith(5);
        expect(slider).toHaveValue('5');

        await user.keyboard('{End}');
        expect(slider).toHaveValue('10');

        onChange.mockClear();
        await user.keyboard('{ArrowRight}');

        expect(onChange).not.toHaveBeenCalled();
        expect(slider).toHaveValue('10');
    });

    it('calls onBlur when the thumb loses focus', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(
            <>
                <Slider aria-label="Scale" defaultValue={40} onBlur={onBlur} />
                <button type="button">Next</button>
            </>
        );

        screen.getByRole('slider', { name: 'Scale' }).focus();
        await user.tab();

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(<Slider aria-label="Scale" value={40} onChange={() => undefined} />);

        const slider = screen.getByRole('slider', { name: 'Scale' });
        slider.focus();
        await user.keyboard('{ArrowRight}');

        expect(slider).toHaveValue('40');
    });

    it('applies size and variant classes', () => {
        render(<Slider aria-label="Scale" size="sm" variant="primary" block={false} dataTestId="scale" />);

        const shell = screen.getByTestId('scale');

        expect(shell).toHaveClass(styles.root);
        expect(shell).toHaveClass(styles.sm);
        expect(shell).toHaveClass(styles.primary);
        expect(shell).not.toHaveClass(styles.block);
    });

    it('sets aria-invalid when invalid', () => {
        render(<Slider aria-label="Scale" invalid dataTestId="scale" />);

        expect(screen.getByRole('slider', { name: 'Scale' })).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('scale')).toHaveAttribute('data-invalid');
    });

    it('renders no ticks when the step would flood the track', () => {
        const { container } = render(<Slider aria-label="Scale" minValue={0} maxValue={100} step={1} />);

        expect(container.querySelectorAll(`.${styles.tick}`)).toHaveLength(0);
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(<Slider aria-label="Scale" defaultValue={40} />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(<Slider aria-label="Scale" disabled defaultValue={40} />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(<Slider aria-label="Scale" invalid defaultValue={40} />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
