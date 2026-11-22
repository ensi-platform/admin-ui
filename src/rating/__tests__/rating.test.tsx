import { createRef, type ReactElement } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { render as renderPure } from '@testing-library/react/pure';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { Rating } from '..';

import styles from '../styles.module.css';

const zone = (value: number) => {
    const node = document.querySelector(`[data-zone="${value}"]`);

    if (!(node instanceof HTMLElement)) {
        throw new Error(`missing zone ${value}`);
    }

    return node;
};

const fills = () => [...document.querySelectorAll('[data-fill]')].map(node => node.getAttribute('data-fill'));

describe('Rating', () => {
    it('renders a labelled slider and the locale value text', () => {
        render(<Rating aria-label="Score" value={3.5} />);

        const slider = screen.getByRole('slider', { name: 'Score' });

        expect(slider).toHaveValue('3.5');
        expect(slider).toHaveAttribute('aria-valuetext', '3,5 из 5');
        expect(fills()).toEqual(['1', '1', '1', '0.5', '0']);
    });

    it('follows value and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Rating aria-label="Score" value={1} onChange={onChange} />);

        rerender(<Rating aria-label="Score" value={2} onChange={onChange} />);

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('slider', { name: 'Score' })).toHaveValue('2');
        expect(fills()).toEqual(['1', '1', '0', '0', '0']);
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Rating aria-label="Score" value={1} onChange={onChange} />);

        await user.click(zone(2));

        expect(onChange).toHaveBeenCalledWith(2);
        expect(screen.getByRole('slider', { name: 'Score' })).toHaveValue('1');
    });

    it('updates from defaultValue and clears on a second click of the same half', async () => {
        const user = userEvent.setup();

        render(<Rating aria-label="Score" defaultValue={1} />);

        const slider = screen.getByRole('slider', { name: 'Score' });

        expect(slider).toHaveValue('1');

        await user.click(zone(2));
        expect(slider).toHaveValue('2');

        await user.click(zone(2));
        expect(slider).toHaveValue('0');
    });

    it('calls onChange once with the half value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Rating aria-label="Score" defaultValue={0} onChange={onChange} />);

        await user.click(zone(1.5));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(1.5);
    });

    it('keeps the dragged zone instead of clearing', () => {
        const onChange = vi.fn();

        render(<Rating aria-label="Score" defaultValue={1.5} onChange={onChange} />);

        // jsdom: no layout — pointerenter stands in for a drag across zones
        fireEvent.pointerDown(zone(1.5));
        fireEvent.pointerEnter(zone(2));
        fireEvent.pointerUp(zone(2));

        expect(onChange).toHaveBeenCalledWith(2);
        expect(onChange).not.toHaveBeenCalledWith(0);
        expect(screen.getByRole('slider', { name: 'Score' })).toHaveValue('2');
    });

    it('previews the half under the pointer without calling onChange', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Rating aria-label="Score" value={0} onChange={onChange} />);

        await user.hover(zone(2));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('slider', { name: 'Score' })).toHaveValue('0');
        expect(fills()).toEqual(['1', '1', '0', '0', '0']);

        await user.unhover(zone(2));

        expect(fills()).toEqual(['0', '0', '0', '0', '0']);
    });

    it('steps with the arrow keys and jumps with Home and End', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Rating aria-label="Score" defaultValue={1} onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'Score' });

        slider.focus();
        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenCalledWith(1.5);
        expect(slider).toHaveValue('1.5');

        await user.keyboard('{Home}');
        expect(onChange).toHaveBeenCalledWith(0);
        expect(slider).toHaveValue('0');

        await user.keyboard('{End}');
        expect(onChange).toHaveBeenCalledWith(5);
        expect(slider).toHaveValue('5');
    });

    it('does not step past min or max', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Rating aria-label="Score" defaultValue={0} onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'Score' });

        slider.focus();
        await user.keyboard('{ArrowLeft}');

        expect(onChange).not.toHaveBeenCalled();
        expect(slider).toHaveValue('0');

        await user.keyboard('{End}');
        onChange.mockClear();
        await user.keyboard('{ArrowRight}');

        expect(onChange).not.toHaveBeenCalled();
        expect(slider).toHaveValue('5');
    });

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const { rerender } = render(<Rating aria-label="Score" value={1} onChange={onChange} />);

        await user.click(zone(2));
        expect(onChange).toHaveBeenCalledWith(2);

        onChange.mockClear();
        rerender(<Rating aria-label="Score" value={1} disabled onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'Score' });

        await user.click(zone(3));
        slider.focus();
        await user.keyboard('{ArrowRight}');

        expect(onChange).not.toHaveBeenCalled();
        expect(slider).toHaveValue('1');
    });

    it('keeps a disabled slider when readOnly is also set', () => {
        render(<Rating aria-label="Score" value={3} disabled readOnly />);

        expect(screen.getByRole('slider', { name: 'Score' })).toBeDisabled();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders a read-only image and ignores hover', async () => {
        const user = userEvent.setup();

        render(<Rating readOnly value={3.5} />);

        const image = screen.getByRole('img', { name: '3,5 из 5' });

        expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        expect(document.querySelector('[data-zone]')).toBeNull();
        expect(fills()).toEqual(['1', '1', '1', '0.5', '0']);

        await user.hover(image);

        expect(fills()).toEqual(['1', '1', '1', '0.5', '0']);
        expect(image).not.toHaveAttribute('data-preview');
    });

    it('prefixes the read-only name with aria-label', () => {
        render(<Rating readOnly aria-label="Score" value={3.5} />);

        expect(screen.getByRole('img', { name: 'Score, 3,5 из 5' })).toBeInTheDocument();
    });

    it('sets aria-invalid when invalid', () => {
        render(<Rating aria-label="Score" invalid />);

        expect(screen.getByRole('slider', { name: 'Score' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies size and variant classes', () => {
        render(<Rating aria-label="Score" size="sm" variant="primary" dataTestId="score" />);

        const root = screen.getByTestId('score');

        expect(root.className).toContain(styles.sm);
        expect(root.className).toContain(styles.primary);
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Rating aria-label="Score" dataTestId="score" />);

        expect(screen.getByTestId('score')).toBeInTheDocument();
    });

    it('assigns the ref to the range input', () => {
        const ref = createRef<HTMLInputElement>();

        render(<Rating aria-label="Score" ref={ref} />);

        expect(ref.current).toBe(screen.getByRole('slider', { name: 'Score' }));
        expect(ref.current?.tagName).toBe('INPUT');
    });

    it('calls onBlur when the slider loses focus', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(
            <>
                <Rating aria-label="Score" onBlur={onBlur} />
                <button type="button">Next</button>
            </>
        );

        screen.getByRole('slider', { name: 'Score' }).focus();
        await user.tab();

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('uses the ratingValue label template', () => {
        const ui = (node: ReactElement) => (
            <AdminUiProvider labels={{ ratingValue: '{value}/{max}' }}>{node}</AdminUiProvider>
        );

        render(ui(<Rating aria-label="Score" value={3.5} />));

        expect(screen.getByRole('slider', { name: 'Score' })).toHaveAttribute('aria-valuetext', '3,5/5');
    });

    it('has no axe violations in the default, disabled, invalid, and read-only states', async () => {
        const { container, rerender } = render(<Rating aria-label="Score" value={3} />);

        expect(await axe(container)).toHaveNoViolations();

        rerender(<Rating aria-label="Score" value={3} disabled />);
        expect(await axe(container)).toHaveNoViolations();

        rerender(<Rating aria-label="Score" value={3} invalid />);
        expect(await axe(container)).toHaveNoViolations();

        rerender(<Rating readOnly value={3.5} />);
        expect(await axe(container)).toHaveNoViolations();
    });

    it('throws without AdminUiProvider', () => {
        expect(() => renderPure(<Rating aria-label="Score" />)).toThrow(
            'AdminUiProvider is required. Wrap the app with <AdminUiProvider>.'
        );
    });
});
