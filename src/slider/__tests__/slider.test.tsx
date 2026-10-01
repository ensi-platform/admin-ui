import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

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

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Slider aria-label="Scale" disabled onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'Scale' });

        expect(slider).toBeDisabled();
        await user.click(slider);

        expect(onChange).not.toHaveBeenCalled();
    });
});
