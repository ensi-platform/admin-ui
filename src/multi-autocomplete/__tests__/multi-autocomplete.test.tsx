import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { MultiAutocomplete } from '..';

import styles from '../styles.module.css';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
    { value: 'new', label: 'новый' },
];

const renderMulti = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('MultiAutocomplete', () => {
    it('renders combobox', () => {
        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} />);

        expect(screen.getByRole('combobox', { name: /Tags/ })).toBeInTheDocument();
    });

    it('applies block class by default', () => {
        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} dataTestId="tags" />);

        expect(screen.getByTestId('tags')).toHaveClass(styles.block);
    });

    it('selects multiple options', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} onChange={onChange} />);

        const input = screen.getByRole('combobox', { name: /Tags/ });

        expect(input).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));
        await user.click(await screen.findByRole('option', { name: 'vip' }));
        await user.click(screen.getByRole('option', { name: 'новый' }));

        expect(onChange).toHaveBeenLastCalledWith(expect.arrayContaining(['vip', 'new']));
    });

    it('clears selection', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <MultiAutocomplete aria-label="Tags" options={OPTIONS} value={['vip']} clear onChange={onChange} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith([]);
    });
});
