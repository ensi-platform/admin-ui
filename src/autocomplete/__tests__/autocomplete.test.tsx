import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '@/field';
import { AdminUiProvider } from '@/provider';

import { Autocomplete } from '..';

import clearStyles from '@/field-clear-button/styles.module.css';
import listStyles from '@/combobox/components/List/styles.module.css';
import triggerStyles from '@/combobox/components/Trigger/styles.module.css';
import styles from '../styles.module.css';

const OPTIONS = [
    { value: 'msk', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'kzn', label: 'Казань', disabled: true },
];

const FieldBoundAutocomplete = () => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Autocomplete {...controlProps} options={OPTIONS} size={size} invalid={invalid} disabled={disabled} />;
};

describe('Autocomplete', () => {
    it('renders combobox', () => {
        render(<Autocomplete aria-label="City" options={OPTIONS} />);

        expect(screen.getByRole('combobox', { name: /City/ })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Autocomplete aria-label="City" options={OPTIONS} dataTestId="city-autocomplete" />);

        expect(screen.getByTestId('city-autocomplete')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        const { container } = render(<Autocomplete aria-label="City" options={OPTIONS} size="sm" variant="primary" />);

        expect(container.querySelector(`.${triggerStyles.sm}`)).toBeInTheDocument();
        expect(container.querySelector(`.${triggerStyles.primary}`)).toBeInTheDocument();
    });

    it('applies block class by default', () => {
        render(<Autocomplete aria-label="City" options={OPTIONS} dataTestId="city-autocomplete" />);

        expect(screen.getByTestId('city-autocomplete')).toHaveClass(styles.block);
    });

    it('filters and selects an option', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Autocomplete aria-label="City" options={OPTIONS} onChange={onChange} />);

        const input = screen.getByRole('combobox', { name: /City/ });

        await user.click(input);
        await user.type(input, 'Санкт');

        const listbox = await screen.findByRole('listbox');

        expect(listbox).toHaveClass(listStyles.md);
        await user.click(screen.getByRole('option', { name: 'Санкт-Петербург' }));

        expect(onChange).toHaveBeenCalledWith('spb');
    });

    it('clears value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Autocomplete aria-label="City" options={OPTIONS} value="msk" clear onChange={onChange} />
            </AdminUiProvider>
        );

        expect(document.querySelector(`.${clearStyles.clear}`)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('shows loading status', async () => {
        const user = userEvent.setup();

        render(
            <AdminUiProvider>
                <Autocomplete aria-label="City" options={[]} isLoading clientFilter={false} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));

        expect(await screen.findByRole('status')).toHaveAttribute('aria-label', 'Loading suggestions');
    });

    it('does not open when disabled', async () => {
        const user = userEvent.setup();

        render(<Autocomplete aria-label="City" options={OPTIONS} disabled />);

        await user.click(screen.getByRole('combobox', { name: /City/ }));

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('wires Field control props', () => {
        render(
            <Field>
                <Field.Label>Город</Field.Label>
                <FieldBoundAutocomplete />
            </Field>
        );

        expect(screen.getByRole('combobox', { name: 'Город' })).toBeInTheDocument();
    });
});
