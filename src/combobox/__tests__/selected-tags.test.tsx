import { render, screen } from '@testing-library/react';
import { render as renderBare } from '@testing-library/react/pure';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SelectedTags } from '../components/MultiTrigger/SelectedTags';

vi.mock('../hooks/useTagOverflow', () => ({
    useTagOverflow: () => ({
        visibleCount: 1,
        containerRef: { current: null },
        measureRef: { current: null },
        overflowMeasureRef: { current: null },
    }),
}));

const ITEMS = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
    { value: 'c', label: 'Gamma' },
];

describe('SelectedTags', () => {
    it('expands when overflow chip is clicked', async () => {
        const user = userEvent.setup();
        const onExpandedChange = vi.fn();
        const onRemove = vi.fn();

        render(
            <SelectedTags
                items={ITEMS}
                size="md"
                expanded={false}
                onExpandedChange={onExpandedChange}
                onRemove={onRemove}
                aria-label="Selected"
            />
        );

        await user.click(screen.getByRole('button', { name: /2 ещё выбрано/ }));

        expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('falls back to default overflow label without AdminUiProvider', () => {
        renderBare(
            <SelectedTags
                items={ITEMS}
                size="md"
                expanded={false}
                onExpandedChange={vi.fn()}
                onRemove={vi.fn()}
                aria-label="Selected"
            />
        );

        expect(screen.getByRole('button', { name: /2 ещё выбрано/ })).toBeInTheDocument();
    });

    it('removes via TagGroup onRemove', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        render(
            <SelectedTags
                items={ITEMS.slice(0, 1)}
                size="sm"
                expanded
                onExpandedChange={vi.fn()}
                onRemove={onRemove}
                aria-label="Selected"
            />
        );

        const remove = screen.getAllByRole('button').find(btn => btn.getAttribute('slot') === 'remove');

        expect(remove).toBeTruthy();
        await user.click(remove!);
        expect(onRemove).toHaveBeenCalled();
    });
});
