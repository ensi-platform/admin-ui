import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ReviewHarness, makeFiles, renderZone, row } from './helpers';

describe('Dropzone review: keys and focus', () => {
    it('ignores Delete and Escape while focus is outside the dropzone', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        renderZone(
            <>
                <button type="button">Outside</button>
                <ReviewHarness initial={makeFiles(['a.txt', 'b.txt'])} onRemove={onRemove} />
            </>
        );

        await user.click(row('a.txt'));
        screen.getByRole('button', { name: 'Outside' }).focus();
        await user.keyboard('{Delete}');
        await user.keyboard('{Escape}');

        expect(onRemove).not.toHaveBeenCalled();
        expect(screen.getByText('Выбрано 1 из 2')).toBeInTheDocument();
    });

    it('does not let another dropzone react to Delete', async () => {
        const user = userEvent.setup();
        const onRemoveA = vi.fn();
        const onRemoveB = vi.fn();

        renderZone(
            <>
                <div data-testid="a">
                    <ReviewHarness initial={makeFiles(['a1.txt', 'a2.txt'])} onRemove={onRemoveA} />
                </div>
                <div data-testid="b">
                    <ReviewHarness initial={makeFiles(['b1.txt', 'b2.txt'])} onRemove={onRemoveB} />
                </div>
            </>
        );

        await user.click(row('a1.txt'));
        row('b1.txt').focus();
        await user.keyboard('{Delete}');

        expect(onRemoveA).not.toHaveBeenCalled();
        expect(onRemoveB).not.toHaveBeenCalled();
    });

    it('announces every removal again even when the text repeats', async () => {
        const user = userEvent.setup();

        renderZone(<ReviewHarness initial={makeFiles(['a.txt', 'b.txt', 'c.txt', 'd.txt'])} />);

        await user.click(row('b.txt'));
        await user.keyboard('{Delete}');

        const first = screen.getByRole('status');

        await user.click(row('c.txt'));
        await user.keyboard('{Delete}');

        const next = screen.getByRole('status');

        expect(next).toHaveTextContent(/Удалено 1/);
        expect(next).not.toBe(first);
    });

    it('announces and moves focus when a single file is removed with its button', async () => {
        const user = userEvent.setup();

        renderZone(<ReviewHarness initial={makeFiles(['a.txt', 'b.txt', 'c.txt'])} />);

        await user.click(screen.getAllByRole('button', { name: 'Удалить файл' })[1]!);

        expect(screen.getByRole('status')).toHaveTextContent(/Удалено 1/);
        await waitFor(() => {
            expect([row('a.txt'), row('c.txt')]).toContain(document.activeElement);
        });
    });
});
