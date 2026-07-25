import { type ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Modal } from '@/modal';
import { AdminUiProvider } from '@/provider';

import { ModalHub } from '../ModalHub';
import { ModalProvider } from '../ModalProvider';
import { type IModalHubItemProps } from '../types';
import { useModal } from '../useModal';

const HarnessModal = ({
    open,
    onOpenChange,
    onExitComplete,
    title = 'Hub modal',
}: IModalHubItemProps & { title?: string }) => (
    <Modal open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete} dataTestId="hub-modal">
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.CloseButton dataTestId="hub-modal-close" />
        </Modal.Header>
        <Modal.Body>Body</Modal.Body>
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
});
