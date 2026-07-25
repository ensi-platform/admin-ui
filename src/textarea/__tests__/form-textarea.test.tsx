import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormTextArea } from '..';

const schema = z.object({
    comment: z.string().min(5, 'Минимум 5 символов'),
});

describe('FormTextArea', () => {
    it('submits typed value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ comment: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormTextArea name="comment" label="Comment" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Comment'), 'Hello world');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ comment: 'Hello world' });
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ comment: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormTextArea name="comment" label="Comment" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Comment'), 'Hi');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Минимум 5 символов');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables textarea when Form is disabled', () => {
        render(
            <Form initialValues={{ comment: '' }} disabled onSubmit={vi.fn()}>
                <FormTextArea name="comment" label="Comment" />
            </Form>
        );

        expect(screen.getByLabelText('Comment')).toBeDisabled();
    });

    it('sets data-test-id on Field root', () => {
        render(
            <Form initialValues={{ comment: '' }} onSubmit={vi.fn()}>
                <FormTextArea name="comment" label="Comment" dataTestId="comment-field" />
            </Form>
        );

        expect(screen.getByTestId('comment-field')).toBeInTheDocument();
    });

    it('renders hint', () => {
        render(
            <Form initialValues={{ comment: '' }} onSubmit={vi.fn()}>
                <FormTextArea name="comment" label="Comment" hint="Optional note" />
            </Form>
        );

        expect(screen.getByText('Optional note')).toBeInTheDocument();
    });

    it('renders without label and with nullish value', () => {
        render(
            <Form initialValues={{ comment: undefined }} onSubmit={vi.fn()}>
                <FormTextArea name="comment" aria-label="Comment" />
            </Form>
        );

        expect(screen.queryByText('Comment')).not.toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue('');
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ comment: 'Hello world' }} onSubmit={onSubmit}>
                    <FormTextArea name="comment" label="Comment" clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ comment: '' });
    });
});
