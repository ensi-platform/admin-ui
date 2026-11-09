import { useState } from 'react';

import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dropzone } from '..';
import { type IDropzoneFile } from '../types';

import {
    ReviewHarness,
    imageFile,
    makeFiles,
    prompt,
    renderZone,
    row,
    textFile,
    upload,
    type TUploadFn,
} from './helpers';

describe('Dropzone upload progress and cancel', () => {
    it('moves the bar with onProgress', async () => {
        const user = userEvent.setup();
        let report: (percent: number) => void = () => undefined;
        const send = vi.fn(
            (_file: File, options: { onProgress: (percent: number) => void; signal: AbortSignal }) =>
                new Promise<{ id: string; url: string }>(() => {
                    report = options.onProgress;
                })
        );

        renderZone(<Dropzone upload={send} />);

        await upload(user, textFile('note.txt'));

        act(() => {
            report(40);
        });

        expect(screen.getByRole('progressbar', { name: 'note.txt' })).toHaveAttribute('aria-valuenow', '40');

        act(() => {
            report(75);
        });

        expect(screen.getByRole('progressbar', { name: 'note.txt' })).toHaveAttribute('aria-valuenow', '75');
    });

    it('shows an indeterminate bar with no number when onProgress is never called', async () => {
        const user = userEvent.setup();
        const send = vi.fn(
            () =>
                new Promise<{ id: string; url: string }>(() => {
                    /* stays pending */
                })
        );

        renderZone(<Dropzone upload={send} />);

        await upload(user, textFile('note.txt'));
        await new Promise(resolve => {
            window.setTimeout(resolve, 300);
        });

        expect(screen.getByRole('progressbar', { name: 'note.txt' })).not.toHaveAttribute('aria-valuenow');
    });

    it('passes file and a live signal to upload', async () => {
        const user = userEvent.setup();
        const send = vi.fn<TUploadFn>(
            () =>
                new Promise(() => {
                    /* stays pending */
                })
        );

        renderZone(<Dropzone upload={send} />);

        await upload(user, textFile('note.txt'));

        const [sent, options] = send.mock.calls[0]!;

        expect(sent.name).toBe('note.txt');
        expect(options.signal.aborted).toBe(false);
        expect(options.onProgress).toEqual(expect.any(Function));
    });

    it('aborts the request, drops the row and does not call onRemove on «Отменить»', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();
        let signal: AbortSignal | undefined;
        const send = vi.fn(
            (_file: File, options: { onProgress: (percent: number) => void; signal: AbortSignal }) =>
                new Promise<{ id: string; url: string }>(() => {
                    signal = options.signal;
                })
        );

        renderZone(<Dropzone upload={send} onRemove={onRemove} onChange={onChange} />);

        await upload(user, textFile('note.txt'));
        await user.click(screen.getByRole('button', { name: 'Отменить' }));

        expect(signal?.aborted).toBe(true);
        expect(screen.queryByText('note.txt')).not.toBeInTheDocument();
        expect(onRemove).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('ignores a late result of a cancelled upload', async () => {
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
        await user.click(screen.getByRole('button', { name: 'Отменить' }));

        await act(async () => {
            finish({ id: 'server-1', url: '/note.txt' });
            await Promise.resolve();
        });

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByText('note.txt')).not.toBeInTheDocument();
    });

    it('lets the user cancel one of two uploads and keeps the other', async () => {
        const user = userEvent.setup();
        const send = vi.fn(
            () =>
                new Promise<{ id: string; url: string }>(() => {
                    /* stays pending */
                })
        );

        renderZone(<Dropzone upload={send} />);

        await upload(user, [textFile('a.txt'), textFile('b.txt')]);

        const rowA = screen.getByText('a.txt').closest('[data-file-id]') as HTMLElement;

        await user.click(within(rowA).getByRole('button', { name: 'Отменить' }));

        expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: 'b.txt' })).toBeInTheDocument();
    });
});

describe('Dropzone review: limits and uploads', () => {
    it('puts accepted types, the per-file limit, and hint on one zone line', () => {
        renderZone(<Dropzone accept={{ 'image/png': ['.png'] }} aria-label="Files" hint="800×600" maxSize={1024} />);

        expect(screen.getByLabelText('Files').parentElement).toHaveTextContent('PNG · до 1 КБ на файл · 800×600');
    });

    it('keeps both files when the first validate is still running', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        let releaseFirst: () => void = () => undefined;
        const first = new Promise<void>(resolve => {
            releaseFirst = resolve;
        });
        let calls = 0;

        renderZone(
            <Dropzone
                onChange={onChange}
                validate={() => {
                    calls += 1;

                    if (calls === 1) {
                        return first.then(() => undefined);
                    }

                    return undefined;
                }}
            />
        );

        const input = screen.getByLabelText(prompt);
        const firstUpload = user.upload(input, textFile('a.txt'));

        await waitFor(() => {
            expect(calls).toBe(1);
        });

        const secondUpload = user.upload(input, textFile('b.txt'));

        await secondUpload;
        releaseFirst();
        await firstUpload;

        await waitFor(() => {
            expect(calls).toBe(2);
            const names = (onChange.mock.calls.at(-1)?.[0] as IDropzoneFile[]).map(file => file.name);

            expect(names).toEqual(['a.txt', 'b.txt']);
        });
        expect(screen.getByText('a.txt')).toBeInTheDocument();
        expect(screen.getByText('b.txt')).toBeInTheDocument();
    });

    it('counts an upload that is still being checked toward maxFiles', async () => {
        const user = userEvent.setup();
        let releaseFirst: () => void = () => undefined;
        const first = new Promise<void>(resolve => {
            releaseFirst = resolve;
        });
        let calls = 0;
        const hang = () =>
            new Promise<{ id: string; url: string }>(() => {
                /* stays pending */
            });

        renderZone(
            <Dropzone
                maxFiles={1}
                upload={hang}
                validate={() => {
                    calls += 1;

                    if (calls === 1) {
                        return first.then(() => undefined);
                    }

                    return undefined;
                }}
            />
        );

        const input = screen.getByLabelText(prompt);
        const firstUpload = user.upload(input, textFile('a.txt'));

        await waitFor(() => {
            expect(calls).toBe(1);
        });

        const secondUpload = user.upload(input, textFile('b.txt'));

        await secondUpload;
        releaseFirst();
        await firstUpload;

        await waitFor(() => {
            expect(screen.getByRole('progressbar', { name: 'a.txt' })).toBeInTheDocument();
        });
        expect(screen.queryByRole('progressbar', { name: 'b.txt' })).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Можно добавить не больше 1 файлов');
    });

    it('does not put back a file removed while its replacement is still being checked', async () => {
        const user = userEvent.setup();
        let release: () => void = () => undefined;
        const gate = new Promise<void>(resolve => {
            release = resolve;
        });
        let calls = 0;

        const Harness = () => {
            const [files, setFiles] = useState<IDropzoneFile[]>([
                { id: 'old', name: 'old.txt', size: 1, type: 'text/plain' },
            ]);

            return (
                <>
                    <button type="button" onClick={() => setFiles([])}>
                        Clear
                    </button>
                    <Dropzone
                        value={files}
                        onChange={setFiles}
                        validate={() => {
                            calls += 1;

                            return gate.then(() => undefined);
                        }}
                    />
                </>
            );
        };

        renderZone(<Harness />);

        const pending = user.upload(screen.getByLabelText(prompt), textFile('new.txt'));

        await waitFor(() => {
            expect(calls).toBe(1);
        });
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        release();
        await pending;

        await waitFor(() => {
            expect(screen.getByText('new.txt')).toBeInTheDocument();
        });
        expect(screen.queryByText('old.txt')).not.toBeInTheDocument();
    });

    it('shows the thrown validate reason and keeps the file out', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(
            <Dropzone
                onChange={onChange}
                validate={() => {
                    throw new Error('битый файл');
                }}
            />
        );

        await upload(user, textFile('a.txt'));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByRole('row', { name: 'a.txt' })).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('a.txt: битый файл');
    });

    it('keeps a file out when validate returns a resolution reason', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone onChange={onChange} validate={() => 'минимум 800×600'} />);

        await upload(user, imageFile('photo.png'));

        expect(onChange).not.toHaveBeenCalled();
        expect(document.querySelector('[data-file-id]')).toBeNull();
        expect(screen.getByRole('alert')).toHaveTextContent('photo.png: минимум 800×600');
    });

    it('keeps the files that fit into maxFiles and names the rest', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone maxFiles={2} onChange={onChange} />);

        await upload(user, [textFile('a.txt'), textFile('b.txt'), textFile('c.txt')]);

        expect((onChange.mock.calls.at(-1)?.[0] as IDropzoneFile[]).map(file => file.name)).toEqual(['a.txt', 'b.txt']);
        expect(screen.getByRole('alert')).toHaveTextContent(/c\.txt/);
    });

    it('aborts in-flight uploads on unmount and ignores a late result', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        let signal: AbortSignal | undefined;
        let finish: (result: { id: string; url: string }) => void = () => undefined;
        const send = (_file: File, options: { signal: AbortSignal }) =>
            new Promise<{ id: string; url: string }>(resolve => {
                signal = options.signal;
                finish = resolve;
            });

        const { unmount } = renderZone(<Dropzone upload={send} onChange={onChange} />);

        await upload(user, textFile('note.txt'));
        unmount();

        expect(signal?.aborted).toBe(true);

        await act(async () => {
            finish({ id: 'server-1', url: '/note.txt' });
            await Promise.resolve();
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not retry a failed file that no longer fits the total', async () => {
        const user = userEvent.setup();
        const send = vi
            .fn<(file: File) => Promise<{ id: string; url: string }>>()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce({ id: 'server-b', url: '/b.txt' });

        renderZone(<Dropzone maxTotalSize={5} upload={send} />);

        await upload(user, textFile('a.txt', '123'));
        await screen.findByText('offline');
        await upload(user, textFile('b.txt', '123'));

        await waitFor(() => {
            expect(screen.getByText('b.txt')).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: 'Повторить' }));

        expect(send).toHaveBeenCalledTimes(2);
        expect(screen.getByText('offline')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent(/a\.txt/);
        expect(screen.getByRole('alert')).toHaveTextContent(/не хватило места/);
    });

    it('drops a failed replacement and keeps the current file', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();

        renderZone(
            <Dropzone
                maxFiles={1}
                value={makeFiles(['old.txt'])}
                onChange={onChange}
                onRemove={onRemove}
                upload={() => Promise.reject(new Error('offline'))}
            />
        );

        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('one.txt'));
        const failed = (await screen.findByText('offline')).closest('[data-file-id]');

        await user.click(within(failed as HTMLElement).getByRole('button', { name: 'Удалить файл' }));

        expect(screen.queryByText('offline')).not.toBeInTheDocument();
        expect(screen.queryByText('one.txt')).not.toBeInTheDocument();
        expect(screen.getByText('old.txt')).toBeInTheDocument();
        expect(onRemove).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not count a failed upload against the quota', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone maxFiles={2} upload={() => Promise.reject(new Error('offline'))} />);

        await upload(user, textFile('a.txt'));
        await screen.findByText('offline');

        expect(screen.getByText(/0 из 2/)).toBeInTheDocument();
        expect(screen.getByLabelText(prompt)).toBeEnabled();
    });

    it('lets a new file replace a failed replacement in the single slot', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const send = vi
            .fn<(file: File) => Promise<{ id: string; url: string }>>()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce({ id: 'server-2', url: '/two.txt' });

        renderZone(<Dropzone maxFiles={1} defaultValue={makeFiles(['old.txt'])} onChange={onChange} upload={send} />);

        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('one.txt'));
        await screen.findByText('offline');
        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('two.txt'));

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect((onChange.mock.calls[0]?.[0] as IDropzoneFile[]).map(file => file.id)).toEqual(['server-2']);
        expect(screen.queryByText('one.txt')).not.toBeInTheDocument();
    });

    it('marks the file that will be replaced and flashes the new one', async () => {
        const user = userEvent.setup();

        renderZone(<ReviewHarness initial={makeFiles(['old.txt'])} maxFiles={1} />);

        const zone = screen.getByLabelText('Перетащите файл, чтобы заменить').parentElement as HTMLElement;

        fireEvent.dragEnter(zone, {
            dataTransfer: {
                files: [textFile('new.txt')],
                items: [{ kind: 'file', type: 'text/plain' }],
                types: ['Files'],
            },
        });

        await waitFor(() => {
            expect(screen.getByText('Отпустите, чтобы заменить «old.txt»')).toBeInTheDocument();
        });
        expect(screen.getByText(/будет заменён/)).toBeInTheDocument();

        fireEvent.dragLeave(zone);
        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('new.txt'));

        expect(row('new.txt')).toHaveAttribute('data-flash');
    });

    it('draws a tile and two lines inside a loading skeleton', () => {
        renderZone(<Dropzone loading dataTestId="files" />);

        const skeleton = screen.getByTestId('files').querySelector('[data-dropzone-skeleton]');

        expect(skeleton?.querySelector('[data-dropzone-skeleton-tile]')).not.toBeNull();
        expect(skeleton?.querySelectorAll('[data-dropzone-skeleton-line]')).toHaveLength(2);
    });

    it('uses a grid skeleton in grid layout', () => {
        renderZone(<Dropzone loading layout="grid" dataTestId="files" />);

        expect(
            screen.getByTestId('files').querySelector('[data-dropzone-skeletons][data-layout="grid"]')
        ).not.toBeNull();
    });
});
