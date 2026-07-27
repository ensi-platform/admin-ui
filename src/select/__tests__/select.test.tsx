import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import listStyles from '@/combobox/components/List/styles.module.css';
import popoverStyles from '@/combobox/components/Popover/styles.module.css';
import triggerStyles from '@/combobox/components/Trigger/styles.module.css';
import { Field, useField } from '@/field';
import clearStyles from '@/field-clear-button/styles.module.css';
import { AdminUiProvider } from '@/provider';

import { Select } from '..';

import styles from '../styles.module.css';

const OPTIONS = [
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликован' },
    { value: 'archived', label: 'Архив', disabled: true },
];

const FieldBoundSelect = () => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Select {...controlProps} options={OPTIONS} size={size} invalid={invalid} disabled={disabled} />;
};

describe('Select', () => {
    it('renders combobox', () => {
        render(<Select aria-label="Status" options={OPTIONS} />);

        expect(screen.getByRole('button', { name: /Status/ })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Select aria-label="Status" options={OPTIONS} dataTestId="status-select" />);

        expect(screen.getByTestId('status-select')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        const { container } = render(<Select aria-label="Status" options={OPTIONS} size="sm" variant="primary" />);

        expect(container.querySelector(`.${triggerStyles.sm}`)).toBeInTheDocument();
        expect(container.querySelector(`.${triggerStyles.primary}`)).toBeInTheDocument();
    });

    it('applies list size and variant classes when open', async () => {
        const user = userEvent.setup();

        render(<Select aria-label="Status" options={OPTIONS} size="sm" variant="primary" />);

        await user.click(screen.getByRole('button', { name: /Status/ }));

        const listbox = screen.getByRole('listbox');
        const popover = listbox.closest(`.${popoverStyles.root}`);

        expect(popover).toHaveClass(popoverStyles.primary);
        expect(listbox).toHaveClass(listStyles.sm);
    });

    it('applies clear size and variant classes', () => {
        const { container } = render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Select aria-label="Status" options={OPTIONS} value="draft" clear size="lg" variant="primary" />
            </AdminUiProvider>
        );

        const clearButton = container.querySelector(`.${clearStyles.clear}`);

        expect(clearButton).toHaveClass(clearStyles.lg);
        expect(clearButton).toHaveClass(clearStyles.primary);
    });

    it('applies block class by default', () => {
        render(<Select aria-label="Status" options={OPTIONS} dataTestId="status-select" />);

        expect(screen.getByTestId('status-select')).toHaveClass(styles.block);
    });

    it('omits block class when block={false}', () => {
        render(<Select aria-label="Status" options={OPTIONS} dataTestId="status-select" block={false} />);

        expect(screen.getByTestId('status-select')).not.toHaveClass(styles.block);
    });

    it('selects an option', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Select aria-label="Status" options={OPTIONS} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: /Status/ }));
        await user.click(screen.getByRole('option', { name: 'Опубликован' }));

        expect(onChange).toHaveBeenCalledWith('published');
    });

    it('clears value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const { container } = render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Select aria-label="Status" options={OPTIONS} value="draft" clear onChange={onChange} />
            </AdminUiProvider>
        );

        expect(container.querySelector(`.${triggerStyles.chevron}`)).toBeInTheDocument();
        expect(container.querySelector(`.${clearStyles.clear}`)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('does not open when disabled', async () => {
        const user = userEvent.setup();

        render(<Select aria-label="Status" options={OPTIONS} disabled />);

        const trigger = screen.getByRole('button', { name: /Status/ });

        expect(trigger).toBeDisabled();

        await user.click(trigger);

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('sets data-invalid when invalid', () => {
        const { container } = render(<Select aria-label="Status" options={OPTIONS} invalid />);

        expect(container.querySelector('[data-invalid]')).toBeInTheDocument();
    });

    it('works inside Field', async () => {
        const user = userEvent.setup();

        render(
            <Field>
                <Field.Label>Статус</Field.Label>
                <FieldBoundSelect />
            </Field>
        );

        await user.click(screen.getByRole('button', { name: /Статус/ }));

        const listbox = screen.getByRole('listbox');

        expect(within(listbox).getByRole('option', { name: 'Черновик' })).toBeInTheDocument();
    });

    it('opens from field click on Group', () => {
        render(<Select aria-label="Status" options={OPTIONS} />);

        fireEvent.click(screen.getByRole('group'));

        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('does not open when interactive target inside trigger is clicked', () => {
        const { container } = render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Select aria-label="Status" options={OPTIONS} value="draft" clear />
            </AdminUiProvider>
        );

        const group = screen.getByRole('group');
        const chevron = container.querySelector(`.${triggerStyles.chevron}`);

        expect(chevron).toBeTruthy();
        fireEvent.click(group, { target: chevron! });

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not open from field click when disabled', () => {
        render(<Select aria-label="Status" options={OPTIONS} value="draft" disabled />);

        fireEvent.click(screen.getByRole('group'));

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
});
