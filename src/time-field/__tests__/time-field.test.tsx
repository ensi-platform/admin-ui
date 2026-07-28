import { Time } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { TimeField } from '../Component';

const renderField = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('TimeField', () => {
    it('renders time field', () => {
        renderField(<TimeField aria-label="Время" dataTestId="time" />);
        expect(screen.getByTestId('time')).toBeInTheDocument();
    });

    it('clears value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderField(<TimeField aria-label="Время" clear value={new Time(14, 30)} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('clears uncontrolled defaultValue', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderField(<TimeField aria-label="Время" clear defaultValue={new Time(14, 30)} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(onChange).toHaveBeenCalledWith(null);
        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });
});
