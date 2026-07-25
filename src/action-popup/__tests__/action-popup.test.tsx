import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import buttonStyles from '@/button/styles.module.css';
import { AdminUiProvider } from '@/provider';

import { ActionPopup, ConfirmModal, DeleteModal } from '../index';
import { type IActionPopupProps, type TConfirmModalProps } from '../types';

const ConfirmHarness = ({
    open: openProp = true,
    onOpenChange,
    onConfirm = vi.fn(),
    ...props
}: Partial<TConfirmModalProps> & {
    open?: boolean;
    onConfirm?: TConfirmModalProps['onConfirm'];
}) => {
    const [open, setOpen] = useState(openProp);

    return (
        <AdminUiProvider
            labels={{
                confirm: 'Подтвердить',
                cancel: 'Отмена',
                delete: 'Удалить',
                notDelete: 'Не удалять',
            }}
        >
            <ConfirmModal
                {...props}
                open={open}
                title={props.title ?? 'Подтверждение'}
                onConfirm={onConfirm}
                onOpenChange={next => {
                    setOpen(next);
                    onOpenChange?.(next);
                }}
            >
                {props.children ?? 'Описание'}
            </ConfirmModal>
        </AdminUiProvider>
    );
};

const DeleteHarness = ({
    open: openProp = true,
    onOpenChange,
    onConfirm = vi.fn(),
    ...props
}: Partial<TConfirmModalProps> & {
    open?: boolean;
    onConfirm?: TConfirmModalProps['onConfirm'];
}) => {
    const [open, setOpen] = useState(openProp);

    return (
        <AdminUiProvider
            labels={{
                confirm: 'Подтвердить',
                cancel: 'Отмена',
                delete: 'Удалить',
                notDelete: 'Не удалять',
            }}
        >
            <DeleteModal
                {...props}
                open={open}
                title={props.title ?? 'Удаление'}
                onConfirm={onConfirm}
                onOpenChange={next => {
                    setOpen(next);
                    onOpenChange?.(next);
                }}
            >
                {props.children ?? 'Действие необратимо'}
            </DeleteModal>
        </AdminUiProvider>
    );
};

const ActionPopupHarness = (props: Omit<IActionPopupProps, 'open' | 'onOpenChange'> & { open?: boolean }) => {
    const [open, setOpen] = useState(props.open ?? true);

    return (
        <AdminUiProvider>
            <ActionPopup {...props} open={open} onOpenChange={setOpen} />
        </AdminUiProvider>
    );
};

describe('ConfirmModal', () => {
    it('renders title, body and label buttons', () => {
        render(<ConfirmHarness />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Подтверждение' })).toBeInTheDocument();
        expect(screen.getByText('Описание')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Подтвердить' })).toHaveClass(buttonStyles.primary);
    });

    it('closes on cancel', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<ConfirmHarness onOpenChange={onOpenChange} />);

        await user.click(screen.getByRole('button', { name: 'Отмена' }));

        expect(onOpenChange).toHaveBeenCalledWith(false);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('calls onConfirm and closes on success', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn().mockResolvedValue(undefined);
        const onOpenChange = vi.fn();

        render(<ConfirmHarness onConfirm={onConfirm} onOpenChange={onOpenChange} />);

        await user.click(screen.getByRole('button', { name: 'Подтвердить' }));

        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalledTimes(1);
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it('keeps open when onConfirm rejects', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn().mockRejectedValue(new Error('fail'));
        const onOpenChange = vi.fn();

        render(<ConfirmHarness onConfirm={onConfirm} onOpenChange={onOpenChange} />);

        await user.click(screen.getByRole('button', { name: 'Подтвердить' }));

        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalledTimes(1);
        });

        expect(onOpenChange).not.toHaveBeenCalledWith(false);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('disables buttons while onConfirm is pending', async () => {
        const user = userEvent.setup();
        let resolveConfirm: (() => void) | undefined;
        const onConfirm = vi.fn(
            () =>
                new Promise<void>(resolve => {
                    resolveConfirm = resolve;
                })
        );

        render(<ConfirmHarness onConfirm={onConfirm} />);

        await user.click(screen.getByRole('button', { name: 'Подтвердить' }));

        expect(screen.getByRole('button', { name: 'Подтвердить' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Отмена' })).toBeDisabled();

        resolveConfirm?.();

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('disables confirm when isConfirmDisabled', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();

        render(<ConfirmHarness isConfirmDisabled onConfirm={onConfirm} />);

        expect(screen.getByRole('button', { name: 'Подтвердить' })).toBeDisabled();

        await user.click(screen.getByRole('button', { name: 'Подтвердить' }));

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('closes on Escape', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<ConfirmHarness onOpenChange={onOpenChange} />);

        await user.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('does not close on Escape while onConfirm is pending', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        let resolveConfirm: (() => void) | undefined;
        const onConfirm = vi.fn(
            () =>
                new Promise<void>(resolve => {
                    resolveConfirm = resolve;
                })
        );

        render(<ConfirmHarness onConfirm={onConfirm} onOpenChange={onOpenChange} />);

        await user.click(screen.getByRole('button', { name: 'Подтвердить' }));

        await user.keyboard('{Escape}');

        expect(onOpenChange).not.toHaveBeenCalledWith(false);
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        resolveConfirm?.();

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});

describe('DeleteModal', () => {
    it('renders danger confirm button and delete labels', () => {
        render(<DeleteHarness />);

        expect(screen.getByRole('button', { name: 'Не удалять' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Удалить' })).toHaveClass(buttonStyles.danger);
    });
});

describe('ActionPopup', () => {
    it('renders custom labels and tone', () => {
        render(
            <ActionPopupHarness title="Custom" confirmLabel="Yes" cancelLabel="No" tone="danger" onConfirm={vi.fn()}>
                Body
            </ActionPopupHarness>
        );

        expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yes' })).toHaveClass(buttonStyles.danger);
    });

    it('renders without body when children are omitted', () => {
        render(<ActionPopupHarness title="Custom" confirmLabel="Yes" cancelLabel="No" onConfirm={vi.fn()} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Custom' })).toBeInTheDocument();
        expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });
});
