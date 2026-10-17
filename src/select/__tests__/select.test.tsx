import { createRef } from 'react';

import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import listStyles from '@/combobox/components/List/styles.module.css';
import popoverStyles from '@/combobox/components/Popover/styles.module.css';
import triggerStyles from '@/combobox/components/Trigger/styles.module.css';
import { Field, useField } from '@/field';
import clearStyles from '@/field-clear-button/styles.module.css';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

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

    it('shows the selected label and keeps it when the value prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <Select aria-label="Status" options={OPTIONS} value="published" onChange={onChange} />
        );

        expect(screen.getByRole('button', { name: /Опубликован/ })).toBeInTheDocument();

        rerender(<Select aria-label="Status" options={OPTIONS} value="draft" onChange={onChange} />);

        expect(screen.getByRole('button', { name: /Черновик/ })).toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('shows the default value label', () => {
        render(<Select aria-label="Status" options={OPTIONS} defaultValue="published" />);

        expect(screen.getByRole('button', { name: /Опубликован/ })).toBeInTheDocument();
    });

    it('does not select a disabled option', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Select aria-label="Status" options={OPTIONS} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: /Status/ }));

        const archived = screen.getByRole('option', { name: 'Архив' });

        expect(archived).toHaveAttribute('aria-disabled', 'true');

        await user.click(archived);
        expect(onChange).not.toHaveBeenCalled();

        await user.click(screen.getByRole('option', { name: 'Черновик' }));
        expect(onChange).toHaveBeenCalledWith('draft');
    });

    it('commits with the keyboard and returns focus on Escape', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Select aria-label="Status" options={OPTIONS} onChange={onChange} />);

        const trigger = screen.getByRole('button', { name: /Status/ });

        trigger.focus();
        await user.keyboard('{ArrowDown}');

        expect(screen.getByRole('listbox')).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(trigger).toHaveFocus();
        });

        await user.keyboard('{ArrowDown}{Enter}');

        expect(onChange).toHaveBeenCalledWith('draft');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not open from field click when disabled', () => {
        render(<Select aria-label="Status" options={OPTIONS} value="draft" disabled />);

        fireEvent.click(screen.getByRole('group'));

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows the placeholder until a value is selected', () => {
        const { rerender } = render(
            <Select aria-label="Status" options={OPTIONS} placeholder="Выберите…" value={null} />
        );

        expect(within(screen.getByRole('group')).getByText('Выберите…')).toBeInTheDocument();

        rerender(<Select aria-label="Status" options={OPTIONS} placeholder="Выберите…" value="draft" />);

        expect(within(screen.getByRole('group')).queryByText('Выберите…')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Черновик/ })).toBeInTheDocument();
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Select aria-label="Status" options={OPTIONS} value="draft" onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: /Черновик/ }));
        await user.click(screen.getByRole('option', { name: 'Опубликован' }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('published');
        expect(screen.getByRole('button', { name: /Черновик/ })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Опубликован/ })).not.toBeInTheDocument();
    });

    it('moves with ArrowUp, Home, and End, and skips a disabled option', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const options = [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana', disabled: true },
            { value: 'cherry', label: 'Cherry' },
        ];

        render(<Select aria-label="Fruit" options={options} onChange={onChange} />);

        const trigger = screen.getByRole('button', { name: /Fruit/ });

        trigger.focus();
        await user.keyboard('{ArrowDown}');

        expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();

        await user.keyboard('{ArrowDown}');

        expect(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus();

        await user.keyboard('{Home}');

        expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();

        await user.keyboard('{End}');

        expect(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus();

        await user.keyboard('{ArrowUp}{Enter}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('jumps to a matching option with type-ahead', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const options = [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'cherry', label: 'Cherry' },
        ];

        render(<Select aria-label="Fruit" options={options} onChange={onChange} />);

        const trigger = screen.getByRole('button', { name: /Fruit/ });

        trigger.focus();
        await user.keyboard('{ArrowDown}b');

        expect(screen.getByRole('option', { name: 'Banana' })).toHaveFocus();

        await user.keyboard('{Enter}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('calls onBlur when focus leaves the trigger', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(
            <>
                <Select aria-label="Status" options={OPTIONS} onBlur={onBlur} />
                <button type="button">Next</button>
            </>
        );

        await user.tab();
        await user.tab();

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('assigns object ref', () => {
        const ref = createRef<HTMLDivElement>();

        render(<Select ref={ref} aria-label="Status" options={OPTIONS} />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(<Select aria-label="Status" options={OPTIONS} />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(<Select aria-label="Status" options={OPTIONS} disabled />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(<Select aria-label="Status" options={OPTIONS} invalid />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
