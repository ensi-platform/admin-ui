import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormDropzone } from '..';
import { type IDropzoneFile, type IDropzoneUploadResult } from '../types';

const prompt = 'Нажмите, чтобы загрузить, или перетащите файл';

const textFile = (name: string, contents = 'hello') => new File([contents], name, { type: 'text/plain' });

const pendingUpload = () =>
    new Promise<IDropzoneUploadResult>(() => {
        /* stays pending */
    });

describe('FormDropzone', () => {
    it('submits the picked file', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form initialValues={{ files: [] as IDropzoneFile[] }} onSubmit={onSubmit}>
                    <FormDropzone name="files" label="Attachments" />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.upload(screen.getByLabelText('Attachments'), textFile('note.txt'));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        const files = onSubmit.mock.calls[0]?.[0].files as IDropzoneFile[];

        expect(files).toHaveLength(1);
        expect(files[0]).toMatchObject({ name: 'note.txt', type: 'text/plain' });
        expect(files[0]?.file).toBeInstanceOf(File);
    });

    it('shows the schema message and does not submit', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form
                    initialValues={{ files: [] as IDropzoneFile[] }}
                    validationSchema={z.object({
                        files: z.array(z.custom<IDropzoneFile>()).min(1, 'Add a file'),
                    })}
                    onSubmit={onSubmit}
                >
                    <FormDropzone name="files" label="Attachments" />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Add a file');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows a rejection under the field and still submits the files already kept', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form initialValues={{ files: [] as IDropzoneFile[] }} onSubmit={onSubmit}>
                    <FormDropzone name="files" label="Attachments" maxSize={1} />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.upload(screen.getByLabelText('Attachments'), [textFile('a.txt', 'a'), textFile('b.txt', 'hello')]);

        expect(screen.getByText('a.txt')).toBeInTheDocument();
        expect(screen.queryByText('b.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Файл больше 1 Б');

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0]?.[0].files).toEqual([expect.objectContaining({ name: 'a.txt' })]);
    });

    it('does not submit while an upload is still running', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form
                    initialValues={{ files: [] as IDropzoneFile[] }}
                    validationSchema={z.object({ files: z.array(z.custom<IDropzoneFile>()) })}
                    onSubmit={onSubmit}
                >
                    <FormDropzone name="files" label="Attachments" upload={pendingUpload} />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.upload(screen.getByLabelText('Attachments'), textFile('note.txt'));

        expect(screen.getByRole('progressbar', { name: 'note.txt' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Дождитесь окончания загрузки');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit while a failed upload is still in the list', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form initialValues={{ files: [] as IDropzoneFile[] }} onSubmit={onSubmit}>
                    <FormDropzone
                        name="files"
                        label="Attachments"
                        upload={() => Promise.reject(new Error('offline'))}
                    />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.upload(screen.getByLabelText('Attachments'), textFile('note.txt'));
        expect(await screen.findByText('offline')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить файл');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits only the replacement for a single slot', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const old: IDropzoneFile = { id: 'old', name: 'old.txt', size: 1, type: 'text/plain' };

        render(
            <AdminUiProvider>
                <Form initialValues={{ files: [old] }} onSubmit={onSubmit}>
                    <FormDropzone name="files" label="Attachments" maxFiles={1} />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.upload(screen.getByLabelText('Attachments'), textFile('new.txt'));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0]?.[0].files).toEqual([expect.objectContaining({ name: 'new.txt' })]);
    });

    it('submits the list without the files removed in bulk', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const files: IDropzoneFile[] = ['a', 'b', 'c'].map(name => ({
            id: name,
            name: `${name}.txt`,
            size: 1,
            type: 'text/plain',
        }));

        render(
            <AdminUiProvider>
                <Form initialValues={{ files }} onSubmit={onSubmit}>
                    <FormDropzone name="files" label="Attachments" />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('row', { name: 'a.txt' }));
        await user.click(screen.getByRole('button', { name: 'Выбрать все' }));
        await user.keyboard('{Control>}');
        await user.click(screen.getByRole('row', { name: 'b.txt' }));
        await user.keyboard('{/Control}');
        await user.click(screen.getByRole('button', { name: 'Удалить выбранные' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0]?.[0].files).toEqual([expect.objectContaining({ id: 'b' })]);
    });

    it('points ref at the dropzone root', () => {
        const ref = createRef<HTMLDivElement>();

        render(
            <AdminUiProvider>
                <Form initialValues={{ files: [] as IDropzoneFile[] }} onSubmit={vi.fn()}>
                    <FormDropzone ref={ref} name="files" label="Attachments" />
                </Form>
            </AdminUiProvider>
        );

        expect(ref.current).toContainElement(screen.getByLabelText('Attachments'));
    });

    it('renders hint', () => {
        render(
            <AdminUiProvider>
                <Form initialValues={{ files: [] as IDropzoneFile[] }} onSubmit={vi.fn()}>
                    <FormDropzone name="files" label="Attachments" hint="PNG only" />
                </Form>
            </AdminUiProvider>
        );

        expect(screen.getByText('PNG only')).toBeInTheDocument();
        expect(screen.getByText(prompt)).toBeInTheDocument();
    });
});
