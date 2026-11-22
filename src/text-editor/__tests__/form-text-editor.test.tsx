import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormTextEditor } from '..';

describe('FormTextEditor', () => {
    it('submits the HTML string', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form initialValues={{ body: '<p>Hello</p>' }} onSubmit={onSubmit}>
                    <FormTextEditor name="body" label="Body" />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });
        expect(onSubmit.mock.calls[0][0]).toEqual({ body: '<p>Hello</p>' });
    });

    it('submits a script string for the host to sanitize', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form initialValues={{ body: '<script>alert(1)</script>' }} onSubmit={onSubmit}>
                    <FormTextEditor name="body" label="Body" />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await screen.findByRole('textbox', { name: 'Body' });
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });
        expect(onSubmit.mock.calls[0][0]).toEqual({ body: '<script>alert(1)</script>' });
    });

    it('writes source edits into the form and submits them', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form initialValues={{ body: '' }} onSubmit={onSubmit}>
                    <FormTextEditor name="body" label="Body" />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(await screen.findByRole('button', { name: 'Исходник' }));
        const box = screen.getByRole('textbox', { name: 'Body' });

        await user.clear(box);
        await user.type(box, '<p>Hello world</p>');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });
        expect(onSubmit.mock.calls[0][0]).toEqual({ body: '<p>Hello world</p>' });
    });

    it('marks only mapped fields as read-only', async () => {
        const user = userEvent.setup();

        render(
            <AdminUiProvider>
                <Form
                    initialValues={{ body: '<p>a</p>', note: '<p>b</p>' }}
                    readOnly={{ body: true }}
                    onSubmit={vi.fn()}
                >
                    <FormTextEditor name="body" label="Body" />
                    <FormTextEditor name="note" label="Note" />
                </Form>
            </AdminUiProvider>
        );

        const sourceButtons = await screen.findAllByRole('button', { name: 'Исходник' });

        await user.click(sourceButtons[0]!);

        expect(screen.getByRole('textbox', { name: 'Body' })).toHaveAttribute('readonly');
        expect(screen.getByRole('textbox', { name: 'Note' })).not.toHaveAttribute('readonly');
    });
});
