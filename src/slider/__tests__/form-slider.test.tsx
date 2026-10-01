import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';

import { FormSlider } from '..';

describe('FormSlider', () => {
    it('submits the slider value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ scale: 40 }} onSubmit={onSubmit}>
                <FormSlider name="scale" label="Scale" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ scale: 40 });
    });

    it('shows a validation error', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const schema = z.object({
            scale: z.number().min(50, 'Минимум 50'),
        });

        render(
            <Form initialValues={{ scale: 40 }} validationSchema={schema} onSubmit={onSubmit}>
                <FormSlider name="scale" label="Scale" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Минимум 50');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders the label and hint', () => {
        render(
            <Form initialValues={{ scale: 10 }} onSubmit={vi.fn()}>
                <FormSlider name="scale" label="Scale" hint="From the base size" />
            </Form>
        );

        expect(screen.getByRole('slider')).toBeInTheDocument();
        expect(screen.getByText('Scale')).toBeInTheDocument();
        expect(screen.getByText('From the base size')).toBeInTheDocument();
    });

    it('renders without a label', () => {
        render(
            <Form initialValues={{ scale: 10 }} onSubmit={vi.fn()}>
                <FormSlider name="scale" aria-label="Scale without caption" />
            </Form>
        );

        expect(screen.getByRole('slider', { name: 'Scale without caption' })).toBeInTheDocument();
        expect(screen.queryByText('Scale without caption')).not.toBeInTheDocument();
    });

    it('updates the field on change and blur', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ scale: 40 }} onSubmit={onSubmit}>
                <FormSlider name="scale" label="Scale" />
                <button type="submit">Save</button>
            </Form>
        );

        const slider = screen.getByRole('slider');
        slider.focus();
        await user.keyboard('{ArrowRight}');
        await user.tab();
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ scale: 41 });
    });

    it('falls back to minValue when the field value is not a number', () => {
        render(
            <Form initialValues={{ scale: null }} onSubmit={vi.fn()}>
                <FormSlider name="scale" label="Scale" minValue={12} />
            </Form>
        );

        expect(screen.getByRole('slider')).toHaveValue('12');
    });
});
