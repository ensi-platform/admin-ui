import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { FieldClearButton } from '..';

describe('FieldClearButton', () => {
    it('uses the provider clear label', () => {
        render(
            <AdminUiProvider labels={{ clear: 'Сбросить' }}>
                <FieldClearButton isDisabled={false} size="md" variant="primary" onClear={vi.fn()} />
            </AdminUiProvider>
        );

        expect(screen.getByRole('button', { name: 'Сбросить' })).toBeEnabled();
    });

    it('calls onClear once and does not bubble the click', async () => {
        const user = userEvent.setup();
        const onClear = vi.fn();
        const onParentClick = vi.fn();

        render(
            <AdminUiProvider>
                <div onClick={onParentClick}>
                    <FieldClearButton isDisabled={false} size="md" variant="primary" onClear={onClear} />
                </div>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onClear).toHaveBeenCalledTimes(1);
        expect(onParentClick).not.toHaveBeenCalled();
    });

    it('does not bubble pointerdown and keeps focus on the previous control', async () => {
        const user = userEvent.setup();
        const onParentPointerDown = vi.fn();

        render(
            <AdminUiProvider>
                <button type="button">Trigger</button>
                <div onPointerDown={onParentPointerDown}>
                    <FieldClearButton isDisabled={false} size="md" variant="primary" onClear={vi.fn()} />
                </div>
            </AdminUiProvider>
        );

        const trigger = screen.getByRole('button', { name: 'Trigger' });

        trigger.focus();
        await user.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('button', { name: 'Очистить' }) });

        expect(onParentPointerDown).not.toHaveBeenCalled();
        expect(trigger).toHaveFocus();
    });

    it('does not call onClear when disabled', async () => {
        const user = userEvent.setup();
        const onClear = vi.fn();

        render(
            <AdminUiProvider>
                <FieldClearButton isDisabled size="md" variant="primary" onClear={onClear} />
            </AdminUiProvider>
        );

        const button = screen.getByRole('button', { name: 'Очистить' });

        expect(button).toBeDisabled();
        await user.click(button);

        expect(onClear).not.toHaveBeenCalled();
    });
});
