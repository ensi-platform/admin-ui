import { createRef, useState } from 'react';

import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Download } from '@/icons';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { Dropzone, type IFileListProps } from '..';
import { type IDropzoneFile, type IDropzoneItem } from '../types';

import { imageFile, makeFiles, prompt, renderZone, textFile, upload } from './helpers';

describe('Dropzone', () => {
    it('adds a file from the picker', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone onChange={onChange} />);

        await upload(user, textFile('note.txt'));

        expect(screen.getByText('note.txt')).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledTimes(1);

        const [files] = onChange.mock.calls[0] as [IDropzoneFile[]];

        expect(files).toHaveLength(1);
        expect(files[0]).toMatchObject({ name: 'note.txt', type: 'text/plain', size: 5 });
        expect(files[0]?.file).toBeInstanceOf(File);
        expect(files[0]?.id).toEqual(expect.any(String));
    });

    it('keeps the list when the parent ignores onChange', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone value={[]} onChange={onChange} />);

        await upload(user, textFile('note.txt'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('note.txt')).not.toBeInTheDocument();
    });

    it('rejects a file over maxSize and shows the reason', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone maxSize={1} onChange={onChange} />);

        await upload(user, textFile('big.txt', 'hello'));

        expect(screen.queryByText('big.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Файл больше 1 Б');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('adds valid files from a mixed batch and shows the rejection', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone maxSize={1} />);

        await upload(user, [textFile('ok.txt', 'a'), textFile('big.txt', 'hello')]);

        expect(screen.getByText('ok.txt')).toBeInTheDocument();
        expect(screen.queryByText('big.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Файл больше 1 Б');
    });

    it('clears the rejection after a selection with no failures', async () => {
        // The file dialog can be overridden; do not let the test runner drop the file before our check.
        const user = userEvent.setup({ applyAccept: false });

        renderZone(<Dropzone accept={{ 'image/png': ['.png'] }} />);

        await upload(user, textFile('note.txt'));

        expect(screen.getByRole('alert')).toHaveTextContent('Недопустимый тип файла');

        await upload(user, imageFile('photo.png'));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByText('photo.png')).toBeInTheDocument();
    });

    it('does not add a file whose name is already in the list', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone onChange={onChange} />);

        await upload(user, textFile('note.txt'));
        await user.upload(screen.getByLabelText(prompt), textFile('note.txt'));

        expect(screen.getAllByText('note.txt')).toHaveLength(1);
        expect(screen.getByRole('alert')).toHaveTextContent('Файл с таким именем уже добавлен');
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('shows the accepted types on the zone before and after a file', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg'] }} />);

        expect(screen.getByText('PNG, JPG')).toBeInTheDocument();

        await upload(user, imageFile('photo.png'));

        expect(screen.getByLabelText(prompt)).toBeEnabled();
        expect(screen.getByText('PNG, JPG')).toBeInTheDocument();
    });

    it('keeps the large zone after a file is added', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone />);

        const zone = screen.getByLabelText(prompt);

        await upload(user, textFile('note.txt'));

        const file = screen.getByText('note.txt');

        expect(screen.getByLabelText(prompt)).toBe(zone);
        expect(zone.compareDocumentPosition(file)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('places the title and description above the zone and the files below it', () => {
        const files: IDropzoneFile[] = [{ id: 'a', name: 'a.txt', size: 1, type: 'text/plain' }];

        renderZone(<Dropzone title="Attachments" description="Up to 5 MB" value={files} />);

        const title = screen.getByText('Attachments');
        const description = screen.getByText('Up to 5 MB');
        const zone = screen.getByLabelText(prompt);
        const file = screen.getByText('a.txt');

        expect(title.compareDocumentPosition(description)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
        expect(description.compareDocumentPosition(zone)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
        expect(zone.compareDocumentPosition(file)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('rejects a file name longer than maxFileNameLength', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone maxFileNameLength={3} />);

        await upload(user, textFile('abcd.txt'));

        expect(screen.queryByText('abcd.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Имя длиннее 3 символов');
    });

    it('rejects a file whose type is outside accept', async () => {
        const user = userEvent.setup({ applyAccept: false });

        renderZone(<Dropzone accept={{ 'image/png': ['.png'] }} />);

        await upload(user, textFile('note.txt'));

        expect(screen.queryByText('note.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Недопустимый тип файла');
    });

    it('removes a file and calls onRemove with that file', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();

        renderZone(<Dropzone onRemove={onRemove} onChange={onChange} />);

        await upload(user, textFile('note.txt'));
        await user.click(screen.getByRole('button', { name: 'Удалить файл' }));

        expect(screen.queryByText('note.txt')).not.toBeInTheDocument();
        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onRemove.mock.calls[0]?.[0]).toMatchObject({ name: 'note.txt' });
        expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it('does not add a file when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone disabled onChange={onChange} />);

        await upload(user, textFile('note.txt'));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByText('note.txt')).not.toBeInTheDocument();
    });

    it('keeps the remove button visible but inert when removal is disabled', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();

        renderZone(<Dropzone disabled={{ remove: true }} onRemove={onRemove} onChange={onChange} />);

        await upload(user, textFile('note.txt'));

        const remove = screen.getByRole('button', { name: 'Удалить файл' });

        expect(screen.getByText('note.txt')).toBeInTheDocument();
        expect(remove).toBeDisabled();

        await user.click(remove);

        expect(onRemove).not.toHaveBeenCalled();
        expect(screen.getByText('note.txt')).toBeInTheDocument();
    });

    it('keeps the remove button visible but inert when disabled', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const files: IDropzoneFile[] = [{ id: 'a', name: 'a.txt', size: 1, type: 'text/plain' }];

        renderZone(<Dropzone disabled value={files} onRemove={onRemove} />);

        const remove = screen.getByRole('button', { name: 'Удалить файл' });

        expect(remove.tagName).toBe('BUTTON');
        expect(remove.querySelector('svg')).toBeInTheDocument();
        expect(remove).toBeDisabled();

        await user.click(remove);

        expect(onRemove).not.toHaveBeenCalled();
    });

    it('shows a reorder handle for several files and hides it for a single slot', () => {
        const files: IDropzoneFile[] = [
            { id: 'a', name: 'a.txt', size: 1, type: 'text/plain' },
            { id: 'b', name: 'b.txt', size: 1, type: 'text/plain' },
        ];

        const { rerender } = renderZone(<Dropzone value={files} onChange={vi.fn()} />);

        expect(screen.getAllByRole('button', { name: 'Изменить порядок' })).toHaveLength(2);

        rerender(
            <AdminUiProvider>
                <Dropzone maxFiles={1} value={[files[0]!]} onChange={vi.fn()} />
            </AdminUiProvider>
        );

        expect(screen.queryByRole('button', { name: 'Изменить порядок' })).not.toBeInTheDocument();
    });

    it('moves a file after another with the keyboard', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const files: IDropzoneFile[] = [
            { id: 'a', name: 'a.txt', size: 1, type: 'text/plain' },
            { id: 'b', name: 'b.txt', size: 1, type: 'text/plain' },
        ];

        renderZone(<Dropzone value={files} onChange={onChange} />);

        screen.getAllByRole('button', { name: 'Изменить порядок' })[0]?.focus();
        await user.keyboard('{Enter}');
        await screen.findByText(/Вставить/);
        await user.keyboard('{ArrowDown}');

        expect(onChange).not.toHaveBeenCalled();

        await user.keyboard('{Enter}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect((onChange.mock.calls.at(-1)?.[0] as IDropzoneFile[]).map(file => file.id)).toEqual(['b', 'a']);
    });

    it('shows an image preview in grid layout', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone layout="grid" />);

        await upload(user, imageFile('photo.png'));

        expect(screen.getByRole('img', { name: 'photo.png' })).toBeInTheDocument();
    });

    it('keeps an image as a name in the list layout', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone accept={{ 'image/png': ['.png'] }} />);

        await upload(user, imageFile('photo.png'));

        expect(screen.getByText('photo.png')).toBeInTheDocument();
        expect(screen.queryByRole('img', { name: 'photo.png' })).not.toBeInTheDocument();
    });

    it('shows the file name without a preview for a non-image accept', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone accept={{ 'text/plain': ['.txt'] }} />);

        await upload(user, textFile('note.txt'));

        expect(screen.getByText('note.txt')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows the file type in the grid when the file is not a picture', () => {
        const files: IDropzoneFile[] = [
            { id: 'brief', name: 'brief.pdf', size: 2048, type: 'application/pdf', url: '/brief.pdf' },
        ];

        renderZone(<Dropzone layout="grid" value={files} />);

        const card = screen.getByText('brief.pdf').closest('[data-file-id]');

        expect(screen.queryByRole('img', { name: 'brief.pdf' })).not.toBeInTheDocument();
        expect(card?.querySelector('svg')).toBeTruthy();
    });

    it('shows the file type in the grid when the picture fails to load', () => {
        const files: IDropzoneFile[] = [
            { id: 'cover', name: 'cover.png', size: 10, type: 'image/png', url: '/missing.png' },
        ];

        renderZone(<Dropzone layout="grid" value={files} />);

        fireEvent.error(screen.getByRole('img', { name: 'cover.png' }));

        const card = screen.getByText('cover.png').closest('[data-file-id]');

        expect(screen.queryByRole('img', { name: 'cover.png' })).not.toBeInTheDocument();
        expect(card?.querySelector('svg')).toBeTruthy();
    });

    it('previews a server file from url', () => {
        const files: IDropzoneFile[] = [
            { id: 'server', name: 'logo.png', size: 10, type: 'image/png', url: '/logo.png' },
        ];

        renderZone(<Dropzone layout="grid" value={files} />);

        expect(screen.getByRole('img', { name: 'logo.png' })).toHaveAttribute('src', '/logo.png');
    });

    it('ignores a pasted file until paste is set', async () => {
        const onChange = vi.fn();
        const pasted = textFile('clip.txt');

        const pasteFile = (node: HTMLElement) => {
            const event = new Event('paste', { bubbles: true });

            Object.defineProperty(event, 'clipboardData', {
                value: { files: [pasted], types: ['Files'], items: [] },
            });
            fireEvent(node, event);
        };

        const { rerender } = renderZone(<Dropzone onChange={onChange} />);

        pasteFile(screen.getByText(prompt));

        expect(onChange).not.toHaveBeenCalled();

        rerender(
            <AdminUiProvider>
                <Dropzone paste onChange={onChange} />
            </AdminUiProvider>
        );

        pasteFile(screen.getByText(prompt));

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect((onChange.mock.calls[0]?.[0] as IDropzoneFile[])[0]?.name).toBe('clip.txt');
    });

    it('hides the list and keeps the zone busy and closed while loading', () => {
        const files: IDropzoneFile[] = [{ id: 'a', name: 'a.txt', size: 1, type: 'text/plain' }];

        const { rerender } = renderZone(<Dropzone loading dataTestId="files" value={files} />);

        expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
        expect(screen.queryByRole('status', { name: 'Загрузка' })).not.toBeInTheDocument();
        expect(screen.getByTestId('files')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByLabelText(prompt)).toBeDisabled();

        rerender(
            <AdminUiProvider>
                <Dropzone dataTestId="files" value={files} />
            </AdminUiProvider>
        );

        expect(screen.getByText('a.txt')).toBeInTheDocument();
        expect(screen.getByTestId('files')).not.toHaveAttribute('aria-busy');
        expect(screen.getByLabelText(prompt)).toBeEnabled();
    });

    it('replaces the zone content with a skeleton while loading', () => {
        renderZone(<Dropzone loading />);

        const zone = screen.getByLabelText(prompt).parentElement;

        expect(zone?.querySelectorAll('[data-dropzone-zone-skeleton]')).toHaveLength(3);
        expect(screen.queryByText(prompt)).not.toBeInTheDocument();
    });

    it('does not take a file while loading', () => {
        const onChange = vi.fn();

        renderZone(<Dropzone loading onChange={onChange} />);

        fireEvent.change(screen.getByLabelText(prompt), { target: { files: [textFile('a.txt')] } });

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
    });

    it.each([
        { count: 0, skeletons: 2 },
        { count: 1, skeletons: 1 },
        { count: 3, skeletons: 3 },
        { count: 5, skeletons: 3 },
    ])('shows $skeletons skeleton rows while loading $count files', ({ count, skeletons }) => {
        const files: IDropzoneFile[] = Array.from({ length: count }, (_, index) => ({
            id: `f${index}`,
            name: `f${index}.txt`,
            size: 1,
            type: 'text/plain',
        }));

        renderZone(<Dropzone loading dataTestId="files" value={files} />);

        expect(screen.getByTestId('files').querySelectorAll('[data-dropzone-skeleton]')).toHaveLength(skeletons);
    });

    it('shows no skeleton when not loading', () => {
        renderZone(<Dropzone dataTestId="files" />);

        expect(screen.getByTestId('files').querySelectorAll('[data-dropzone-skeleton]')).toHaveLength(0);
    });

    it('gives the file to renderAction for every row and keeps the name as plain text', () => {
        const files: IDropzoneFile[] = [
            { id: 'a', name: 'a.txt', size: 1, type: 'text/plain', url: '/a.txt' },
            { id: 'b', name: 'b.txt', size: 1, type: 'text/plain', url: '/b.txt' },
        ];
        const renderAction = vi.fn((file: IDropzoneFile) => <a href={file.url}>Get {file.name}</a>);

        renderZone(<Dropzone value={files} onChange={vi.fn()} renderAction={renderAction} />);

        expect(screen.getByRole('link', { name: 'Get a.txt' })).toHaveAttribute('href', '/a.txt');
        expect(screen.getByRole('link', { name: 'Get b.txt' })).toHaveAttribute('href', '/b.txt');
        expect(renderAction).toHaveBeenCalledWith(files[0]);
        expect(renderAction).toHaveBeenCalledWith(files[1]);
        expect(screen.queryByRole('button', { name: 'a.txt' })).not.toBeInTheDocument();
    });

    it('renders Dropzone.Action as a button and runs the click without removing the file', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderZone(
            <Dropzone
                value={[{ id: 'a.txt', name: 'a.txt', size: 1, type: 'text/plain' }]}
                onChange={vi.fn()}
                renderAction={() => (
                    <Dropzone.Action hidden icon={Download} onClick={onClick}>
                        Download
                    </Dropzone.Action>
                )}
            />
        );

        const button = screen.getByRole('button', { name: 'Download' });

        expect(button.tagName).toBe('BUTTON');
        expect(button).toHaveAttribute('type', 'button');
        expect(button.querySelector('svg')).toBeInTheDocument();
        expect(button).not.toHaveAttribute('hidden');

        await user.click(button);

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.getByText('a.txt')).toBeInTheDocument();
    });

    it('renders no download control without renderAction', () => {
        const files: IDropzoneFile[] = [{ id: 'a', name: 'a.txt', size: 1, type: 'text/plain', url: '/a.txt' }];

        renderZone(<Dropzone value={files} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /скач/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'a.txt' })).not.toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        renderZone(<Dropzone dataTestId="files" />);

        expect(screen.getByTestId('files')).toBeInTheDocument();
    });

    it('points ref at the dropzone root', () => {
        const ref = createRef<HTMLDivElement>();

        renderZone(<Dropzone ref={ref} dataTestId="files" />);

        expect(ref.current).toBe(screen.getByTestId('files'));
    });

    it('keeps a file out of the value until upload resolves', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        let finish: (result: { id: string; url: string }) => void = () => undefined;
        const send = vi.fn(
            () =>
                new Promise<{ id: string; url: string }>(resolve => {
                    finish = resolve;
                })
        );

        renderZone(<Dropzone upload={send} onChange={onChange} />);

        await upload(user, textFile('note.txt'));

        expect(screen.getByText('note.txt')).toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: 'note.txt' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Удалить файл' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Отменить' })).toBeEnabled();
        expect(onChange).not.toHaveBeenCalled();

        finish({ id: 'server-1', url: '/files/note.txt' });

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect(onChange.mock.calls[0]?.[0]).toEqual([
            expect.objectContaining({ id: 'server-1', url: '/files/note.txt', name: 'note.txt' }),
        ]);
        expect(onChange.mock.calls[0]?.[0][0].file).toBeUndefined();
        expect(screen.queryByRole('progressbar', { name: 'note.txt' })).not.toBeInTheDocument();
    });

    it('keeps a settled file beside a row held at 42 percent', async () => {
        const user = userEvent.setup();
        const hold = vi.fn((_file: File, options: { onProgress: (percent: number) => void }) => {
            options.onProgress(42);

            return new Promise<{ id: string; url: string }>(() => {
                /* stays pending */
            });
        });

        renderZone(
            <Dropzone
                defaultValue={[{ id: 'brief', name: 'brief.pdf', size: 2048, type: 'application/pdf' }]}
                upload={hold}
            />
        );

        await upload(user, new File(['video'], 'rough-cut.mov', { type: 'video/quicktime' }));

        expect(screen.getByText('brief.pdf')).toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: 'rough-cut.mov' })).toHaveAttribute('aria-valuenow', '42');
        expect(screen.getByRole('button', { name: 'Отменить' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'Удалить файл' })).toBeEnabled();
    });

    it('hides reorder while a file is still uploading', async () => {
        const user = userEvent.setup();
        const files: IDropzoneFile[] = [
            { id: 'a', name: 'a.txt', size: 1, type: 'text/plain' },
            { id: 'b', name: 'b.txt', size: 1, type: 'text/plain' },
        ];

        const pendingUpload = () =>
            new Promise<{ id: string; url: string }>(() => {
                /* stays pending */
            });

        renderZone(<Dropzone value={files} onChange={vi.fn()} upload={pendingUpload} />);

        expect(screen.getAllByRole('button', { name: 'Изменить порядок' })).toHaveLength(2);

        await user.upload(screen.getByLabelText(prompt), textFile('c.txt'));

        expect(screen.getByRole('progressbar', { name: 'c.txt' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Изменить порядок' })).not.toBeInTheDocument();
    });

    it('keeps a failed upload in the list and retries it', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onRemove = vi.fn();
        const send = vi
            .fn<(file: File) => Promise<{ id: string; url: string }>>()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce({ id: 'server-1', url: '/files/note.txt' });

        renderZone(<Dropzone upload={send} onChange={onChange} onRemove={onRemove} />);

        await upload(user, textFile('note.txt'));

        expect(await screen.findByText('offline')).toHaveAttribute('title', 'offline');
        expect(screen.queryByText('Не удалось загрузить файл')).not.toBeInTheDocument();
        expect(
            within(screen.getByText('note.txt').closest('[data-file-id]') as HTMLElement).queryByText('5 Б')
        ).not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: 'Повторить' }));

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1);
        });
        expect(send).toHaveBeenCalledTimes(2);
        expect(onRemove).not.toHaveBeenCalled();
        expect(screen.queryByText('offline')).not.toBeInTheDocument();
    });

    it('keeps the generic caption when the upload rejects without a message', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone upload={() => Promise.reject(new Error(''))} />);

        await upload(user, textFile('note.txt'));

        expect(await screen.findByText('Не удалось загрузить файл')).toHaveAttribute(
            'title',
            'Не удалось загрузить файл'
        );
    });

    it('replaces a previous reason when the retry rejects without a message', async () => {
        const user = userEvent.setup();
        const send = vi
            .fn<(file: File) => Promise<{ id: string; url: string }>>()
            .mockRejectedValueOnce(new Error('offline'))
            .mockRejectedValueOnce(new Error(''));

        renderZone(<Dropzone upload={send} />);

        await upload(user, textFile('note.txt'));
        expect(await screen.findByText('offline')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Повторить' }));

        expect(await screen.findByText('Не удалось загрузить файл')).toBeInTheDocument();
        expect(screen.queryByText('offline')).not.toBeInTheDocument();
    });

    it('shows a string rejection as the row reason', async () => {
        const user = userEvent.setup();

        // Callers sometimes reject with a string. The row still shows that text.
        // eslint-disable-next-line prefer-promise-reject-errors -- the reason is a string, not an Error
        renderZone(<Dropzone upload={() => Promise.reject('disk full')} />);

        await upload(user, textFile('note.txt'));

        expect(await screen.findByText('disk full')).toHaveAttribute('title', 'disk full');
    });

    it('shows the upload reason on a grid card', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone layout="grid" upload={() => Promise.reject(new Error('offline'))} />);

        await upload(user, textFile('note.txt'));

        expect(await screen.findByText('offline')).toHaveAttribute('title', 'offline');
    });

    it('drops a failed upload without calling onRemove', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();

        renderZone(
            <Dropzone upload={() => Promise.reject(new Error('offline'))} onRemove={onRemove} onChange={onChange} />
        );

        await upload(user, textFile('note.txt'));
        await screen.findByText('offline');

        await user.click(screen.getByRole('button', { name: 'Удалить файл' }));

        expect(screen.queryByText('note.txt')).not.toBeInTheDocument();
        expect(onRemove).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('removes a grid file from the delete button and does not open a menu on right click', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const files: IDropzoneFile[] = [
            { id: 'a', name: 'a.png', size: 1, type: 'image/png', url: '/a.png' },
            { id: 'b', name: 'b.png', size: 1, type: 'image/png', url: '/b.png' },
        ];

        renderZone(<Dropzone layout="grid" value={files} onChange={vi.fn()} onRemove={onRemove} />);

        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Действия с файлом' })).not.toBeInTheDocument();
        expect(screen.getAllByText('1 Б')).toHaveLength(2);

        await user.click(screen.getAllByRole('button', { name: 'Удалить файл' })[0]!);

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onRemove.mock.calls[0]?.[0]).toMatchObject({ id: 'a' });

        fireEvent.contextMenu(screen.getByText('b.png'));

        expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('has no axe violations in the default and disabled states', async () => {
        const { container, rerender } = renderZone(<Dropzone />);

        expect(await axe(container)).toHaveNoViolations();

        rerender(
            <AdminUiProvider>
                <Dropzone disabled />
            </AdminUiProvider>
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});

describe('Dropzone controlled value', () => {
    it('follows value from the parent', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [files, setFiles] = useState<IDropzoneFile[]>([]);

            return <Dropzone value={files} onChange={setFiles} />;
        };

        renderZone(<Harness />);

        await upload(user, textFile('note.txt'));

        expect(screen.getByText('note.txt')).toBeInTheDocument();
    });
});

const CustomItem = ({ file }: IDropzoneItem) => <span>{file.name}</span>;

const CustomList = ({ item: Row, files }: IFileListProps) => (
    <div data-custom-list="">
        {files.map(file => (
            <Row key={file.id} element="div" elementProps={{}} file={file} selected={false} size="md" actions={[]} />
        ))}
    </div>
);

describe('Dropzone list prop', () => {
    it('renders the list and the element passed as props', () => {
        renderZone(<Dropzone list={CustomList} item={CustomItem} defaultValue={makeFiles(['a.txt'])} />);

        expect(screen.getByText('a.txt').closest('[data-custom-list]')).toBeInTheDocument();
    });
});
