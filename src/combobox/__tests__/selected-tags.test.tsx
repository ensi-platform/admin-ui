import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SelectedTags } from '../components/MultiTrigger/SelectedTags';

describe('SelectedTags', () => {
    it('removes a tag', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        render(
            <SelectedTags
                items={[{ value: 'a', label: 'Alpha' }]}
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

        expect(onRemove).toHaveBeenCalledTimes(1);
    });
});
