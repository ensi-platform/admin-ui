import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';

import { FormRating } from '..';

describe('FormRating', () => {
    it('submits the rating value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ score: 3.5 }} onSubmit={onSubmit}>
                <FormRating name="score" label="Score" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ score: 3.5 });
    });

    it('shows a validation error', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const schema = z.object({
            score: z.number().min(4, 'Минимум 4'),
        });

        render(
            <Form initialValues={{ score: 3 }} validationSchema={schema} onSubmit={onSubmit}>
                <FormRating name="score" label="Score" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Минимум 4');
        expect(screen.getByRole('slider')).toHaveAttribute('aria-invalid', 'true');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('restores the field on reset', async () => {
        const user = userEvent.setup();

        render(
            <Form initialValues={{ score: 1 }} onSubmit={vi.fn()}>
                {({ reset }) => (
                    <>
                        <FormRating name="score" label="Score" />
                        <button type="button" onClick={() => reset()}>
                            Reset
                        </button>
                    </>
                )}
            </Form>
        );

        const slider = screen.getByRole('slider');

        slider.focus();
        await user.keyboard('{ArrowRight}');
        expect(slider).toHaveValue('1.5');

        await user.click(screen.getByRole('button', { name: 'Reset' }));

        expect(slider).toHaveValue('1');
    });

    it('renders 0 when the field value is missing', () => {
        render(
            <Form initialValues={{ score: undefined }} onSubmit={vi.fn()}>
                <FormRating name="score" label="Score" />
            </Form>
        );

        expect(screen.getByRole('slider')).toHaveValue('0');
    });

    it('renders the label and hint', () => {
        render(
            <Form initialValues={{ score: 2 }} onSubmit={vi.fn()}>
                <FormRating name="score" label="Score" hint="Product quality" />
            </Form>
        );

        expect(screen.getByText('Score')).toBeInTheDocument();
        expect(screen.getByText('Product quality')).toBeInTheDocument();
    });

    it('shows a read-only image', () => {
        render(
            <Form initialValues={{ score: 3.5 }} onSubmit={vi.fn()}>
                <FormRating name="score" label="Score" readOnly />
            </Form>
        );

        expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        expect(screen.getByRole('img', { name: '3,5 из 5' })).toBeInTheDocument();
    });
});
