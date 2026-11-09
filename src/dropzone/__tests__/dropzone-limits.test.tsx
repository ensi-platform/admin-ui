import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dropzone } from '..';
import { type IDropzoneFile } from '../types';

import { makeFiles, prompt, renderZone, row, textFile, upload } from './helpers';

describe('Dropzone disabled flags', () => {
    it('refuses a file when adding is disabled and still removes', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();

        renderZone(
            <Dropzone
                disabled={{ add: true }}
                value={makeFiles(['a.txt', 'b.txt'])}
                onChange={onChange}
                onRemove={onRemove}
            />
        );

        const input = screen.getByLabelText(prompt);

        expect(input).toBeDisabled();
        expect(screen.getAllByRole('button', { name: 'Изменить порядок' })).toHaveLength(2);

        fireEvent.change(input, { target: { files: [textFile('c.txt')] } });

        expect(onChange).not.toHaveBeenCalled();

        await user.click(screen.getAllByRole('button', { name: 'Удалить файл' })[0]!);

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('hides reorder when reorder is disabled and still accepts a file', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone disabled={{ reorder: true }} value={makeFiles(['a.txt', 'b.txt'])} onChange={onChange} />);

        expect(screen.queryByRole('button', { name: 'Изменить порядок' })).not.toBeInTheDocument();

        await upload(user, textFile('c.txt'));

        expect(onChange).toHaveBeenCalled();
    });

    it('accepts a file when adding is explicitly left on', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone disabled={{ add: false }} onChange={onChange} />);

        await upload(user, textFile('a.txt'));

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});

describe('Dropzone maxTotalSize', () => {
    it('does not add a file over the total and names the file and the room left', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderZone(<Dropzone maxTotalSize={5} onChange={onChange} />);

        await upload(user, textFile('a.txt', '123'));
        await upload(user, textFile('b.txt', '456'));

        expect(screen.queryByText('b.txt')).not.toBeInTheDocument();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('alert')).toHaveTextContent(/b\.txt/);
        expect(screen.getByRole('alert')).toHaveTextContent(/не хватило места, осталось/);
    });

    it('adds a file that exactly fits the total', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone maxTotalSize={6} />);

        await upload(user, textFile('a.txt', '123'));
        await upload(user, textFile('b.txt', '456'));

        expect(screen.getByText('b.txt')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('counts a file that is still uploading toward the total', async () => {
        const user = userEvent.setup();
        const pendingUpload = () =>
            new Promise<{ id: string; url: string }>(() => {
                /* stays pending */
            });

        renderZone(<Dropzone maxTotalSize={5} upload={pendingUpload} />);

        await upload(user, textFile('a.txt', '123'));
        await upload(user, textFile('b.txt', '456'));

        expect(screen.getByRole('progressbar', { name: 'a.txt' })).toBeInTheDocument();
        expect(screen.queryByText('b.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent(/b\.txt/);
    });

    it('lists every refused file of one batch in a single line', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone maxTotalSize={4} />);

        await upload(user, [textFile('a.txt', '123'), textFile('b.txt', '456'), textFile('c.txt', '789')]);

        expect(screen.getAllByRole('alert')).toHaveLength(1);
        expect(screen.getByRole('alert')).toHaveTextContent(/b\.txt/);
        expect(screen.getByRole('alert')).toHaveTextContent(/c\.txt/);
        expect(screen.getByText('a.txt')).toBeInTheDocument();
    });
});

describe('Dropzone quota', () => {
    it('shows the count and the per-file size on an empty list', () => {
        renderZone(<Dropzone maxFiles={20} maxSize={10 * 1024 * 1024} />);

        expect(screen.getByText(/0 из 20/)).toBeInTheDocument();
        expect(screen.getByText(/до .* на файл/)).toBeInTheDocument();
    });

    it('shows the byte quota when maxTotalSize is set', () => {
        renderZone(<Dropzone maxFiles={20} maxTotalSize={25 * 1024 * 1024} />);

        expect(screen.getByText(/0 из 20 · .*из 25/)).toBeInTheDocument();
    });

    it('fills the meter by whichever limit is closer', () => {
        renderZone(
            <Dropzone maxFiles={4} maxTotalSize={100} value={makeFiles(['a.txt', 'b.txt'], 10)} onChange={vi.fn()} />
        );

        const meter = screen.getByRole('meter');

        expect(meter.querySelector('span')).toHaveStyle({ width: '50%' });
        expect(meter).not.toHaveAttribute('data-full');
        expect(meter).toHaveAttribute('aria-valuemin', '0');
        expect(meter).toHaveAttribute('aria-valuemax', '100');
        expect(meter).toHaveAttribute('aria-valuenow', '50');
        expect(meter).toHaveAttribute('aria-valuetext', expect.stringMatching(/2 из 4/));
    });

    it('fills the meter when the file count is reached before the byte limit', () => {
        renderZone(
            <Dropzone maxFiles={2} maxTotalSize={10000} value={makeFiles(['a.txt', 'b.txt'], 10)} onChange={vi.fn()} />
        );

        expect(screen.getByRole('meter')).toHaveAttribute('data-full');
        expect(screen.getByRole('meter').querySelector('span')).toHaveStyle({ width: '100%' });
    });

    it('omits the quota line when no limit is set', () => {
        renderZone(<Dropzone />);

        expect(screen.queryByText(/ из /)).not.toBeInTheDocument();
        expect(screen.queryByText(/на файл/)).not.toBeInTheDocument();
    });

    it('updates the count after a file is added', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone maxFiles={3} />);

        await upload(user, textFile('a.txt'));

        expect(screen.getByText(/1 из 3/)).toBeInTheDocument();
    });

    it('says the limit is reached and keeps the zone closed at the maximum', () => {
        renderZone(<Dropzone maxFiles={2} value={makeFiles(['a.txt', 'b.txt'])} onChange={vi.fn()} />);

        expect(screen.getByText(/Достигнут лимит: 2 из 2/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Достигнут лимит/)).toBeDisabled();
    });

    it('does not say the limit is reached below the maximum', () => {
        renderZone(<Dropzone maxFiles={3} value={makeFiles(['a.txt', 'b.txt'])} onChange={vi.fn()} />);

        expect(screen.queryByText(/Достигнут лимит/)).not.toBeInTheDocument();
        expect(screen.getByLabelText(prompt)).toBeEnabled();
    });
});

describe('Dropzone single slot', () => {
    it('keeps the zone active with the replace text when a file is present', () => {
        renderZone(<Dropzone maxFiles={1} value={makeFiles(['brief.pdf'])} onChange={vi.fn()} />);

        expect(screen.getByText('Перетащите файл, чтобы заменить')).toBeInTheDocument();
        expect(screen.getByLabelText('Перетащите файл, чтобы заменить')).toBeEnabled();
        expect(screen.queryByText(/Достигнут лимит/)).not.toBeInTheDocument();
    });

    it('has no selection, toolbar or reorder, and keeps the remove button', async () => {
        const user = userEvent.setup();

        renderZone(<Dropzone maxFiles={1} value={makeFiles(['brief.pdf'])} onChange={vi.fn()} />);

        await user.click(row('brief.pdf'));

        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Изменить порядок' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Удалить файл' })).toBeEnabled();
    });

    it('swaps the file without upload: onChange first, then onRemove of the old file', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const seen: IDropzoneFile[][] = [];
        const onRemove = vi.fn(() => {
            seen.push((onChange.mock.calls.at(-1)?.[0] as IDropzoneFile[] | undefined) ?? []);
        });
        const old = makeFiles(['old.txt'])[0]!;

        renderZone(<Dropzone maxFiles={1} value={[old]} onChange={onChange} onRemove={onRemove} />);

        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('new.txt'));

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onRemove).toHaveBeenCalledWith(old);
        expect(seen[0]?.map(file => file.name)).toEqual(['new.txt']);
        expect(onChange.mock.invocationCallOrder[0]).toBeLessThan(onRemove.mock.invocationCallOrder[0]!);
    });

    it('keeps the old file until the new upload succeeds, then replaces it', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();
        const old = makeFiles(['old.txt'])[0]!;
        let finish: (result: { id: string; url: string }) => void = () => undefined;
        const send = vi.fn(
            () =>
                new Promise<{ id: string; url: string }>(resolve => {
                    finish = resolve;
                })
        );

        renderZone(<Dropzone maxFiles={1} value={[old]} onChange={onChange} onRemove={onRemove} upload={send} />);

        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('new.txt'));

        expect(screen.getByText('old.txt')).toBeInTheDocument();
        expect(screen.getByText(/заменяется/)).toBeInTheDocument();
        expect(onRemove).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();

        finish({ id: 'server-new', url: '/new.txt' });

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect((onChange.mock.calls[0]?.[0] as IDropzoneFile[]).map(file => file.id)).toEqual(['server-new']);
        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onRemove).toHaveBeenCalledWith(old);
        expect(onChange.mock.invocationCallOrder[0]).toBeLessThan(onRemove.mock.invocationCallOrder[0]!);
    });

    it('keeps the old file and offers retry when the replacement upload fails', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();
        const old = makeFiles(['old.txt'])[0]!;

        renderZone(
            <Dropzone
                maxFiles={1}
                value={[old]}
                onChange={onChange}
                onRemove={onRemove}
                upload={() => Promise.reject(new Error('offline'))}
            />
        );

        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('new.txt'));

        expect(await screen.findByText('offline')).toBeInTheDocument();
        expect(screen.getByText('old.txt')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Повторить' })).toBeEnabled();
        expect(onRemove).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not touch the old file when the new one is rejected and says it was not replaced', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onChange = vi.fn();

        renderZone(
            <Dropzone maxFiles={1} maxSize={1} value={makeFiles(['old.txt'])} onChange={onChange} onRemove={onRemove} />
        );

        await user.upload(screen.getByLabelText('Перетащите файл, чтобы заменить'), textFile('big.txt', 'hello'));

        expect(screen.getByText('old.txt')).toBeInTheDocument();
        expect(screen.queryByText('big.txt')).not.toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent(/Файл не заменён/);
        expect(onRemove).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });
});
