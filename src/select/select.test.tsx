import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '../field/index.js';
import { AdminUiProvider } from '../provider/index.js';

import clearStyles from './components/ClearButton/styles.module.css';
import triggerStyles from './components/Trigger/styles.module.css';

import { Select } from './index.js';

const OPTIONS = [
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликован' },
    { value: 'archived', label: 'Архив', disabled: true },
];

const FieldBoundSelect = () => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <Select {...controlProps} options={OPTIONS} size={size} isInvalid={isInvalid} disabled={disabled} />;
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

    it('applies size class', () => {
        const { container } = render(<Select aria-label="Status" options={OPTIONS} size="sm" />);

        expect(container.querySelector(`.${triggerStyles.sm}`)).toBeInTheDocument();
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

    it('sets data-invalid when isInvalid', () => {
        const { container } = render(<Select aria-label="Status" options={OPTIONS} isInvalid />);

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
});
