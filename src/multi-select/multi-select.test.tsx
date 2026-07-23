import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '../field/index.js';
import { AdminUiProvider } from '../provider/index.js';

import clearStyles from './components/ClearButton/styles.module.css';
import triggerStyles from './components/Trigger/styles.module.css';

import { MultiSelect } from './index.js';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
    { value: 'wholesale', label: 'опт', disabled: true },
];

const FieldBoundMultiSelect = () => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <MultiSelect {...controlProps} options={OPTIONS} size={size} isInvalid={isInvalid} disabled={disabled} />;
};

describe('MultiSelect', () => {
    it('renders combobox button', () => {
        render(<MultiSelect aria-label="Метки" options={OPTIONS} />);

        expect(screen.getByRole('button', { name: /Метки/ })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<MultiSelect aria-label="Метки" options={OPTIONS} dataTestId="tags-select" />);

        expect(screen.getByTestId('tags-select')).toBeInTheDocument();
    });

    it('applies size class', () => {
        const { container } = render(<MultiSelect aria-label="Метки" options={OPTIONS} size="sm" />);

        expect(container.querySelector(`.${triggerStyles.sm}`)).toBeInTheDocument();
    });

    it('selects multiple options', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<MultiSelect aria-label="Метки" options={OPTIONS} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: /Метки/ }));
        await user.click(screen.getByRole('option', { name: 'vip' }));
        await user.click(screen.getByRole('option', { name: 'постоянный клиент' }));

        expect(onChange).toHaveBeenLastCalledWith(['vip', 'regular']);
    });

    it('clears all values when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const { container } = render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <MultiSelect
                    aria-label="Метки"
                    options={OPTIONS}
                    value={['vip', 'regular']}
                    clear
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        expect(container.querySelector(`.${triggerStyles.chevron}`)).toBeInTheDocument();
        expect(container.querySelector(`.${clearStyles.clear}`)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('opens listbox when placeholder is clicked', async () => {
        const user = userEvent.setup();

        render(<MultiSelect aria-label="Метки" options={OPTIONS} placeholder="Выберите…" />);

        await user.click(screen.getByText('Выберите…'));

        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('removes one tag', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <MultiSelect aria-label="Метки" options={OPTIONS} value={['vip', 'regular']} onChange={onChange} />
            </AdminUiProvider>
        );

        const tags = screen.getAllByRole('row');
        expect(tags.length).toBeGreaterThanOrEqual(1);

        const removeButtons = screen.getAllByRole('button').filter(btn => btn.getAttribute('slot') === 'remove');
        expect(removeButtons.length).toBeGreaterThanOrEqual(1);

        await user.click(removeButtons[0]!);

        expect(onChange).toHaveBeenCalled();
        const next = onChange.mock.calls.at(-1)?.[0] as string[];
        expect(next).toHaveLength(1);
        expect(next).not.toContain('vip');
    });

    it('removes tag when tag label is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <MultiSelect aria-label="Метки" options={OPTIONS} value={['vip', 'regular']} onChange={onChange} />
            </AdminUiProvider>
        );

        const vipTag = screen.getAllByRole('row').find(row => row.textContent?.includes('vip'));
        expect(vipTag).toBeTruthy();

        await user.click(within(vipTag!).getByText('vip'));

        expect(onChange).toHaveBeenCalled();
        const next = onChange.mock.calls.at(-1)?.[0] as string[];
        expect(next).toEqual(['regular']);
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
        const user = userEvent.setup();

        render(<MultiSelect aria-label="Метки" options={OPTIONS} disabled />);

        const trigger = screen.getByRole('button', { name: /Метки/ });

        expect(trigger).toBeDisabled();

        await user.click(trigger);

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('sets data-invalid when isInvalid', () => {
        const { container } = render(<MultiSelect aria-label="Метки" options={OPTIONS} isInvalid />);

        expect(container.querySelector('[data-invalid]')).toBeInTheDocument();
    });

    it('works inside Field', async () => {
        const user = userEvent.setup();

        render(
            <Field>
                <Field.Label>Метки</Field.Label>
                <FieldBoundMultiSelect />
            </Field>
        );

        await user.click(screen.getByRole('button', { name: /Метки/ }));

        const listbox = screen.getByRole('listbox');

        expect(within(listbox).getByRole('option', { name: 'vip' })).toBeInTheDocument();
    });
});
