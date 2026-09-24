import { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { ArrangementSettings } from '..';

const Harness = () => {
    const [value, setValue] = useState(['name', 'date']);

    return (
        <AdminUiProvider>
            <ArrangementSettings
                open
                title="Columns"
                items={[
                    { id: 'name', label: 'Name' },
                    { id: 'date', label: 'Date' },
                ]}
                value={value}
                onSave={setValue}
            />
        </AdminUiProvider>
    );
};

describe('ArrangementSettings drag', () => {
    it('unchecks an item on a draggable row', async () => {
        const user = userEvent.setup();

        render(<Harness />);

        const name = screen.getByRole('checkbox', { name: /Name/ });

        expect(name.closest('[draggable="true"]')).not.toBeNull();

        await user.click(name);

        expect(name).not.toBeChecked();
    });
});
