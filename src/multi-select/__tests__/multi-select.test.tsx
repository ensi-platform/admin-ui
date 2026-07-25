import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectStateContext } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '@/field';
import { AdminUiProvider } from '@/provider';

import { MultiSelect } from '..';
import { MultiSelectClearButton } from '../components/ClearButton';

import clearStyles from '../components/ClearButton/styles.module.css';
import listStyles from '../components/List/styles.module.css';
import popoverStyles from '../components/Popover/styles.module.css';
import triggerStyles from '../components/Trigger/styles.module.css';
import styles from '../styles.module.css';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
    { value: 'wholesale', label: 'опт', disabled: true },
];

const FieldBoundMultiSelect = () => {
    const { controlProps, size, invalid, disabled } = useField();

    return <MultiSelect {...controlProps} options={OPTIONS} size={size} invalid={invalid} disabled={disabled} />;
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

    it('applies size and variant classes', () => {
        const { container } = render(<MultiSelect aria-label="Метки" options={OPTIONS} size="sm" variant="primary" />);

        expect(container.querySelector(`.${triggerStyles.sm}`)).toBeInTheDocument();
        expect(container.querySelector(`.${triggerStyles.primary}`)).toBeInTheDocument();
    });

    it('applies list size and variant classes when open', async () => {
        const user = userEvent.setup();

        render(<MultiSelect aria-label="Метки" options={OPTIONS} size="sm" variant="primary" />);

        await user.click(screen.getByRole('button', { name: /Метки/ }));

        const listbox = screen.getByRole('listbox');
        const popover = listbox.closest(`.${popoverStyles.root}`);

        expect(popover).toHaveClass(popoverStyles.primary);
        expect(listbox).toHaveClass(listStyles.sm);
    });

    it('applies clear size and variant classes', () => {
        const { container } = render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <MultiSelect aria-label="Метки" options={OPTIONS} value={['vip']} clear size="lg" variant="primary" />
            </AdminUiProvider>
        );

        const clearButton = container.querySelector(`.${clearStyles.clear}`);

        expect(clearButton).toHaveClass(clearStyles.lg);
        expect(clearButton).toHaveClass(clearStyles.primary);
    });

    it('applies block class by default', () => {
        render(<MultiSelect aria-label="Метки" options={OPTIONS} dataTestId="tags-select" />);

        expect(screen.getByTestId('tags-select')).toHaveClass(styles.block);
    });

    it('omits block class when block={false}', () => {
        render(<MultiSelect aria-label="Метки" options={OPTIONS} dataTestId="tags-select" block={false} />);

        expect(screen.getByTestId('tags-select')).not.toHaveClass(styles.block);
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

    it('sets data-invalid when invalid', () => {
        const { container } = render(<MultiSelect aria-label="Метки" options={OPTIONS} invalid />);

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

    it('does not open when interactive target inside trigger is clicked', () => {
        render(
            <AdminUiProvider>
                <MultiSelect aria-label="Метки" options={OPTIONS} value={['vip']} />
            </AdminUiProvider>
        );

        const group = screen.getByRole('group');
        const row = screen.getByRole('row');

        fireEvent.click(group, { target: row });

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not open from field click when disabled', () => {
        render(
            <AdminUiProvider>
                <MultiSelect aria-label="Метки" options={OPTIONS} value={['vip']} disabled />
            </AdminUiProvider>
        );

        fireEvent.click(screen.getByRole('group'));

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('hides clear button for empty or non-array select values', () => {
        const { rerender, container } = render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <SelectStateContext.Provider value={{ value: null, setValue: vi.fn() } as never}>
                    <MultiSelectClearButton isDisabled={false} size="md" variant="primary" />
                </SelectStateContext.Provider>
            </AdminUiProvider>
        );

        expect(container.querySelector(`.${clearStyles.clear}`)).not.toBeInTheDocument();

        rerender(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <SelectStateContext.Provider value={{ value: 'vip', setValue: vi.fn() } as never}>
                    <MultiSelectClearButton isDisabled={false} size="md" variant="primary" />
                </SelectStateContext.Provider>
            </AdminUiProvider>
        );

        expect(container.querySelector(`.${clearStyles.clear}`)).toBeInTheDocument();

        rerender(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <SelectStateContext.Provider value={{ value: [], setValue: vi.fn() } as never}>
                    <MultiSelectClearButton isDisabled={false} size="md" variant="primary" />
                </SelectStateContext.Provider>
            </AdminUiProvider>
        );

        expect(container.querySelector(`.${clearStyles.clear}`)).not.toBeInTheDocument();
    });
});
