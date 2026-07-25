import { type ReactNode } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '@/modal';
import { AdminUiProvider } from '@/provider';

import { ModalHub } from '../ModalHub';
import { ModalProvider, useModalHubContext } from '../ModalProvider';
import { type IModalHubItemProps } from '../types';
import { useModal } from '../useModal';

const HarnessModal = ({
    open,
    onOpenChange,
    onExitComplete,
    title = 'Hub modal',
    dataTestId = 'hub-modal',
}: IModalHubItemProps & { title?: string; dataTestId?: string }) => (
    <Modal open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete} dataTestId={dataTestId}>
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.CloseButton dataTestId={`${dataTestId}-close`} />
        </Modal.Header>
        <Modal.Body>
            <button type="button" onClick={() => onOpenChange?.(true)}>
                Keep open
            </button>
            Body
        </Modal.Body>
    </Modal>
);

const OpenButton = ({ title }: { title?: string }) => {
    const { onOpenHandler } = useModal({
        Component: HarnessModal,
        props: { title },
    });

    return (
        <button type="button" onClick={onOpenHandler}>
            Open
        </button>
    );
};

const OpenCloseButtons = ({
    onOpenChange,
}: {
    onOpenChange?: IModalHubItemProps['onOpenChange'];
} = {}) => {
    const { onOpenHandler, onCloseHandler } = useModal({
        Component: HarnessModal,
        props: { onOpenChange },
    });

    return (
        <>
            <button type="button" onClick={onOpenHandler}>
                Open
            </button>
            <button type="button" data-test-id="close-via-hook" onClick={onCloseHandler}>
                Close via hook
            </button>
        </>
    );
};

const TwoModalsButtons = () => {
    const first = useModal({
        Component: HarnessModal,
        props: { title: 'First modal', dataTestId: 'hub-modal-a' },
    });
    const second = useModal({
        Component: HarnessModal,
        props: { title: 'Second modal', dataTestId: 'hub-modal-b' },
    });

    return (
        <>
            <button type="button" onClick={first.onOpenHandler}>
                Open first
            </button>
            <button type="button" data-test-id="open-second" onClick={second.onOpenHandler}>
                Open second
            </button>
        </>
    );
};

const RemoveAllButton = () => {
    const { onOpenHandler } = useModal({
        Component: HarnessModal,
        props: { title: 'Removable' },
    });
    const { removeAll } = useModalHubContext();

    return (
        <>
            <button type="button" onClick={onOpenHandler}>
                Open
            </button>
            <button type="button" data-test-id="remove-all" onClick={removeAll}>
                Remove all
            </button>
        </>
    );
};

const renderWithHub = (ui: ReactNode) =>
    render(
        <AdminUiProvider labels={{ close: 'Закрыть' }}>
            <ModalProvider>
                {ui}
                <ModalHub />
            </ModalProvider>
        </AdminUiProvider>
    );

describe('useModal', () => {
    it('throws outside ModalProvider', () => {
        const Probe = () => {
            useModal({ Component: HarnessModal });

            return null;
        };

        expect(() => render(<Probe />)).toThrow('ModalProvider is required');
    });

    it('opens modal via hub', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenButton title="From hub" />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'From hub' })).toBeInTheDocument();
    });

    it('closes modal and removes it after exit', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenButton />);

        await user.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await user.click(screen.getByTestId('hub-modal-close'));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('closes on Escape', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenButton />);

        await user.click(screen.getByRole('button', { name: 'Open' }));
        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('closes via onCloseHandler', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenCloseButtons />);

        await user.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('close-via-hook'));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('onCloseHandler is a no-op before open', () => {
        renderWithHub(<OpenCloseButtons />);

        fireEvent.click(screen.getByTestId('close-via-hook'));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls props.onOpenChange(false) from onCloseHandler', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        renderWithHub(<OpenCloseButtons onOpenChange={onOpenChange} />);

        await user.click(screen.getByRole('button', { name: 'Open' }));
        fireEvent.click(screen.getByTestId('close-via-hook'));

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it('keeps modal open when hub onOpenChange receives true', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenButton />);

        await user.click(screen.getByRole('button', { name: 'Open' }));
        await user.click(screen.getByRole('button', { name: 'Keep open' }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes one modal while keeping another in the stack', async () => {
        const user = userEvent.setup();

        renderWithHub(<TwoModalsButtons />);

        await user.click(screen.getByRole('button', { name: 'Open first' }));
        fireEvent.click(screen.getByTestId('open-second'));

        await waitFor(() => {
            expect(screen.getByTestId('hub-modal-b')).toBeInTheDocument();
        });
        expect(screen.getByTestId('hub-modal-a')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('hub-modal-a-close'));

        await waitFor(() => {
            expect(screen.queryByTestId('hub-modal-a')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('hub-modal-b')).toBeInTheDocument();
    });

    it('removeAll clears all modals', async () => {
        const user = userEvent.setup();

        renderWithHub(<RemoveAllButton />);

        await user.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('remove-all'));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
