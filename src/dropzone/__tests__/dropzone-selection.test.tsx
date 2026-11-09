import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Dropzone } from '..';
import { type IDropzoneFile } from '../types';

import { Harness, ReviewHarness, makeFiles, prompt, renderZone, row, textFile } from './helpers';

describe('Dropzone selection', () => {
    it('selects a row on click without a checkbox and clears it on a second click', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} />);

        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

        await user.click(row('a.txt'));

        expect(row('a.txt')).toHaveAttribute('aria-selected', 'true');
        expect(row('b.txt')).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByText('Выбрано 1 из 3')).toBeInTheDocument();

        await user.click(row('a.txt'));

        expect(row('a.txt')).toHaveAttribute('aria-selected', 'false');
        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
    });

    it('shows a check mark only on the selected row', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt'])} />);

        expect(document.querySelector('[data-dropzone-check]')).not.toBeInTheDocument();

        await user.click(row('a.txt'));

        expect(row('a.txt').querySelector('[data-dropzone-check] svg')).toBeInTheDocument();
        expect(row('b.txt').querySelector('[data-dropzone-check]')).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

        const mark = row('a.txt').querySelector('[data-dropzone-check]');
        const typeIcon = [...row('a.txt').querySelectorAll('svg')].find(
            icon => !mark?.contains(icon) && !icon.closest('button')
        );

        expect(typeIcon?.parentElement?.contains(mark)).toBe(true);

        await user.click(row('a.txt'));

        expect(document.querySelector('[data-dropzone-check]')).not.toBeInTheDocument();
    });

    it('selects a range with Shift and adds a row with Ctrl', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt', 'd.txt'])} />);

        await user.click(row('a.txt'));
        await user.keyboard('{Shift>}');
        await user.click(row('c.txt'));
        await user.keyboard('{/Shift}');

        expect(screen.getByText('Выбрано 3 из 4')).toBeInTheDocument();
        expect(row('d.txt')).toHaveAttribute('aria-selected', 'false');

        await user.keyboard('{Control>}');
        await user.click(row('d.txt'));
        await user.keyboard('{/Control}');

        expect(screen.getByText('Выбрано 4 из 4')).toBeInTheDocument();
    });

    it('adds another row on click and drops only that row on a second click', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} />);

        await user.click(row('a.txt'));
        await user.click(row('b.txt'));

        expect(screen.getByText('Выбрано 2 из 3')).toBeInTheDocument();
        expect(row('c.txt')).toHaveAttribute('aria-selected', 'false');

        await user.click(row('a.txt'));

        expect(row('a.txt')).toHaveAttribute('aria-selected', 'false');
        expect(row('b.txt')).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Выбрано 1 из 3')).toBeInTheDocument();
    });

    it('keeps the row draggable from the name and the size, and blocks a drag from the remove button', async () => {
        renderZone(<Dropzone value={makeFiles(['a.txt', 'b.txt'])} onChange={vi.fn()} />);

        const fileRow = row('a.txt');
        const name = within(fileRow).getByText('a.txt');
        const size = within(fileRow).getByText('1 Б');
        const remove = within(fileRow).getByRole('button', { name: 'Удалить файл' });

        fireEvent.pointerDown(name);

        expect(fileRow).toHaveAttribute('draggable', 'true');

        fireEvent.pointerDown(size);

        expect(fileRow).toHaveAttribute('draggable', 'true');
        expect(document.querySelector('.react-aria-DropIndicator')).not.toBeInTheDocument();

        fireEvent.pointerDown(remove);

        const blocked = new Event('dragstart', { bubbles: true, cancelable: true });

        remove.dispatchEvent(blocked);

        expect(blocked.defaultPrevented).toBe(true);

        await act(async () => {
            await new Promise(resolve => {
                setTimeout(resolve, 0);
            });
        });

        expect(within(fileRow).getByRole('button', { name: 'Изменить порядок' })).toHaveStyle({
            pointerEvents: 'auto',
        });
    });

    it('selects from the name and the size, and ignores the remove button and the grip', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt'])} />);

        const fileRow = row('a.txt');

        await user.click(within(fileRow).getByText('a.txt'));

        expect(fileRow).toHaveAttribute('aria-selected', 'true');

        await user.click(within(fileRow).getByText('1 Б'));

        expect(fileRow).toHaveAttribute('aria-selected', 'false');

        await user.click(fileRow);

        expect(fileRow).toHaveAttribute('aria-selected', 'true');

        await user.click(within(fileRow).getByRole('button', { name: 'Изменить порядок' }));

        expect(fileRow).toHaveAttribute('aria-selected', 'true');

        await user.click(within(fileRow).getByRole('button', { name: 'Удалить файл' }));

        expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
    });

    it('shows a grip on every row in the list and the grid without hovering', () => {
        const files = makeFiles(['a.txt', 'b.txt']);
        const { rerender } = renderZone(<Dropzone value={files} onChange={vi.fn()} />);

        expect(document.querySelectorAll('[data-dropzone-grip]')).toHaveLength(2);

        rerender(
            <AdminUiProvider>
                <Dropzone layout="grid" value={files} onChange={vi.fn()} />
            </AdminUiProvider>
        );

        expect(document.querySelectorAll('[data-dropzone-grip]')).toHaveLength(2);
    });

    it('keeps the grid grip beside the name and the remove button on the frame', () => {
        const files = makeFiles(['a.txt', 'b.txt']);
        const { rerender } = renderZone(<Dropzone value={files} onChange={vi.fn()} />);

        const listRow = row('a.txt');
        const listGrip = within(listRow).getByRole('button', { name: 'Изменить порядок' });
        const listName = within(listRow).getByText('a.txt');

        expect(listGrip.parentElement?.firstElementChild).toBe(listGrip);
        expect(listGrip.parentElement).toContainElement(listName);

        rerender(
            <AdminUiProvider>
                <Dropzone layout="grid" value={files} onChange={vi.fn()} />
            </AdminUiProvider>
        );

        const gridRow = row('a.txt');
        const gridGrip = within(gridRow).getByRole('button', { name: 'Изменить порядок' });
        const remove = within(gridRow).getByRole('button', { name: 'Удалить файл' });
        const gridName = within(gridRow).getByText('a.txt');

        expect(remove.parentElement).not.toContainElement(gridGrip);
        expect(remove.parentElement).not.toContainElement(gridName);
        expect(gridGrip.parentElement).toContainElement(gridName);
    });

    it('lays the file size under the name', () => {
        renderZone(<Dropzone value={makeFiles(['a.txt', 'b.txt'])} onChange={vi.fn()} />);

        const fileRow = row('a.txt');
        const name = within(fileRow).getByText('a.txt');
        const size = within(fileRow).getByText('1 Б');

        expect(fileRow).toHaveAttribute('data-layout', 'stacked');
        expect(name.nextElementSibling).toBe(size);
    });

    it('shows the toolbar only while something is selected', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt'])} />);

        expect(screen.queryByRole('button', { name: 'Выбрать все' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Удалить выбранные' })).not.toBeInTheDocument();

        await user.click(row('a.txt'));

        expect(screen.getByRole('button', { name: 'Выбрать все' }).querySelector('svg')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Снять выделение' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Удалить выбранные' }).querySelector('svg')).toBeInTheDocument();
    });

    it('selects everything with «Выбрать все» and hides that button', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} />);

        await user.click(row('a.txt'));
        await user.click(screen.getByRole('button', { name: 'Выбрать все' }));

        expect(screen.getByText('Выбрано 3 из 3')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Выбрать все' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Удалить выбранные' })).toBeEnabled();
        expect(row('a.txt')).toHaveAttribute('aria-selected', 'true');
        expect(row('c.txt')).toHaveAttribute('aria-selected', 'true');
    });

    it('removes the selected files through onRemove, one call per file', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} onRemove={onRemove} />);

        await user.click(row('a.txt'));
        await user.keyboard('{Control>}');
        await user.click(row('c.txt'));
        await user.keyboard('{/Control}');
        await user.click(screen.getByRole('button', { name: 'Удалить выбранные' }));

        expect(onRemove).toHaveBeenCalledTimes(2);
        expect(onRemove.mock.calls.map(call => (call[0] as IDropzoneFile).id).sort()).toEqual(['a.txt', 'c.txt']);
        expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
        expect(screen.queryByText('c.txt')).not.toBeInTheDocument();
        expect(screen.getByText('b.txt')).toBeInTheDocument();
        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
    });

    it.each(['{Delete}', '{Backspace}'])('removes the selection with %s', async key => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} onRemove={onRemove} />);

        await user.click(row('b.txt'));
        await user.keyboard(key);

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: 'b.txt' }));
        expect(screen.queryByText('b.txt')).not.toBeInTheDocument();
    });

    it('does nothing on Delete when nothing is selected', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt'])} onRemove={onRemove} />);

        row('a.txt').focus();
        await user.keyboard('{Delete}');

        expect(onRemove).not.toHaveBeenCalled();
        expect(screen.getByText('a.txt')).toBeInTheDocument();
    });

    it('clears the selection with Escape', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt'])} />);

        await user.click(row('a.txt'));
        expect(screen.getByText('Выбрано 1 из 2')).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
        expect(row('a.txt')).toHaveAttribute('aria-selected', 'false');
    });

    it('clears the selection with a click outside the list', async () => {
        const user = userEvent.setup();

        renderZone(
            <>
                <button type="button">Outside</button>
                <Harness initial={makeFiles(['a.txt', 'b.txt'])} />
            </>
        );

        await user.click(row('a.txt'));
        expect(screen.getByText('Выбрано 1 из 2')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Outside' }));

        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
    });

    it('moves focus to a neighbour row and announces the removal', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} />);

        await user.click(row('b.txt'));
        await user.keyboard('{Delete}');

        await waitFor(() => {
            expect([row('a.txt'), row('c.txt')]).toContain(document.activeElement);
        });
        expect(screen.getByRole('status')).toHaveTextContent(/Удалено 1/);
    });

    it('announces how many files a batch removal dropped', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} />);

        await user.click(row('a.txt'));
        await user.click(screen.getByRole('button', { name: 'Выбрать все' }));
        await user.click(screen.getByRole('button', { name: 'Удалить выбранные' }));

        expect(screen.getByRole('status')).toHaveTextContent(/Удалено 3/);
    });

    it('shows the hint only while there are several files and none is selected', async () => {
        const user = userEvent.setup();
        const hint = 'Нажмите на файл, чтобы выделить';

        const { rerender } = renderZone(<Dropzone value={makeFiles(['a.txt'])} onChange={vi.fn()} />);

        expect(screen.queryByText(hint)).not.toBeInTheDocument();

        rerender(
            <AdminUiProvider>
                <Harness initial={makeFiles(['a.txt', 'b.txt'])} />
            </AdminUiProvider>
        );

        expect(screen.getByText(hint)).toBeInTheDocument();

        await user.click(row('a.txt'));

        expect(screen.queryByText(hint)).not.toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.getByText(hint)).toBeInTheDocument();
    });

    it('has no toolbar and no selection for a single file', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt'])} />);

        await user.click(row('a.txt'));

        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Удалить выбранные' })).not.toBeInTheDocument();
    });

    it('does not select a row that is still uploading', async () => {
        const user = userEvent.setup();
        const pendingUpload = () =>
            new Promise<{ id: string; url: string }>(() => {
                /* stays pending */
            });
        const onChange = vi.fn();

        renderZone(<Dropzone value={makeFiles(['a.txt', 'b.txt'])} onChange={onChange} upload={pendingUpload} />);

        await user.upload(screen.getByLabelText(prompt), textFile('c.txt'));
        await screen.findByRole('progressbar', { name: 'c.txt' });

        await user.click(screen.getByText('c.txt'));

        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();

        // positive control: a settled row still selects in the same list
        await user.click(row('a.txt'));

        expect(screen.getByText('Выбрано 1 из 2')).toBeInTheDocument();
    });

    it('does not select rows when removal is disabled', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt'])} disabled={{ remove: true }} />);

        await user.click(row('a.txt'));

        expect(row('a.txt')).not.toHaveAttribute('aria-selected', 'true');
        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
        expect(screen.queryByText('Нажмите на файл, чтобы выделить')).not.toBeInTheDocument();
    });

    it('does not select rows when disabled', async () => {
        const user = userEvent.setup();

        renderZone(<Harness initial={makeFiles(['a.txt', 'b.txt'])} disabled />);

        await user.click(row('a.txt'));

        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
    });
});

describe('Dropzone review: selection', () => {
    it('forgets the range anchor after Escape', async () => {
        const user = userEvent.setup();

        renderZone(<ReviewHarness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} />);

        await user.click(row('a.txt'));
        await user.keyboard('{Escape}');
        await user.keyboard('{Shift>}');
        await user.click(row('c.txt'));
        await user.keyboard('{/Shift}');

        expect(screen.getByText('Выбрано 1 из 3')).toBeInTheDocument();
        expect(row('a.txt')).toHaveAttribute('aria-selected', 'false');
    });

    it('keeps the selection when a download link inside the row is clicked', async () => {
        const user = userEvent.setup();

        renderZone(
            <ReviewHarness
                initial={makeFiles(['a.txt', 'b.txt'])}
                renderAction={file => (
                    <a
                        href="#download"
                        onClick={event => {
                            event.preventDefault();
                        }}
                    >
                        Get {file.name}
                    </a>
                )}
            />
        );

        await user.click(row('a.txt'));
        await user.click(screen.getByRole('link', { name: 'Get a.txt' }));

        expect(row('a.txt')).toHaveAttribute('aria-selected', 'true');
    });

    it('drops the selection when loading starts and when only one file is left', () => {
        const files = makeFiles(['a.txt', 'b.txt']);
        const { rerender } = renderZone(<Dropzone value={files} onChange={vi.fn()} />);

        fireEvent.click(row('a.txt'));

        rerender(
            <AdminUiProvider>
                <Dropzone value={files} onChange={vi.fn()} loading />
            </AdminUiProvider>
        );

        expect(screen.queryByText(/Выбрано/)).not.toBeInTheDocument();
    });
});
