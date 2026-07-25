import { type ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '@/modal';
import { AdminUiProvider } from '@/provider';

import { ModalHub } from '../ModalHub';
import { ModalProvider } from '../ModalProvider';
import { type IModalHubItemProps } from '../types';
import { useModalAsync } from '../useModalAsync';

const AsyncModal = ({
    open,
    onOpenChange,
    onExitComplete,
    title = 'Async modal',
}: IModalHubItemProps & { title?: string }) => (
    <Modal open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete} dataTestId="async-modal">
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.CloseButton dataTestId="async-modal-close" />
        </Modal.Header>
        <Modal.Body>Body</Modal.Body>
    </Modal>
);

const OpenAsyncButton = () => {
    const { onOpenHandler } = useModalAsync({
        loadComponent: () => Promise.resolve({ default: AsyncModal }),
        props: { title: 'Lazy title' },
    });

    return (
        <button type="button" onClick={() => onOpenHandler()}>
            Open async
        </button>
    );
};

const OpenAsyncWithOverrideButton = () => {
    const { onOpenHandler } = useModalAsync({
        loadComponent: () => Promise.resolve({ default: AsyncModal }),
        props: { title: 'Base title' },
    });

    return (
        <button type="button" onClick={() => onOpenHandler({ title: 'Override title' })}>
            Open override
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

describe('useModalAsync', () => {
    it('opens lazily loaded modal', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenAsyncButton />);

        await user.click(screen.getByRole('button', { name: 'Open async' }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Lazy title' })).toBeInTheDocument();
        });
    });

    it('applies props override on open', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenAsyncWithOverrideButton />);

        await user.click(screen.getByRole('button', { name: 'Open override' }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Override title' })).toBeInTheDocument();
        });
    });

    it('keeps only the latest open when load races', async () => {
        const user = userEvent.setup();
        let resolveFirst!: (value: { default: typeof AsyncModal }) => void;
        let resolveSecond!: (value: { default: typeof AsyncModal }) => void;
        let loadCount = 0;

        const RaceButton = () => {
            const { onOpenHandler } = useModalAsync({
                loadComponent: () => {
                    loadCount += 1;

                    if (loadCount === 1) {
                        return new Promise(resolve => {
                            resolveFirst = resolve;
                        });
                    }

                    return new Promise(resolve => {
                        resolveSecond = resolve;
                    });
                },
                props: { title: 'Race' },
            });

            return (
                <button type="button" onClick={() => onOpenHandler()}>
                    Race open
                </button>
            );
        };

        renderWithHub(<RaceButton />);

        await user.click(screen.getByRole('button', { name: 'Race open' }));
        await user.click(screen.getByRole('button', { name: 'Race open' }));

        resolveFirst({ default: AsyncModal });
        resolveSecond({ default: AsyncModal });

        await waitFor(() => {
            expect(screen.getAllByRole('dialog')).toHaveLength(1);
        });
    });

    it('ignores synthetic event as props override', async () => {
        const user = userEvent.setup();
        const loadComponent = vi.fn(() => Promise.resolve({ default: AsyncModal }));

        const ButtonWithClick = () => {
            const { onOpenHandler } = useModalAsync({
                loadComponent,
                props: { title: 'From click' },
            });

            return (
                <button type="button" onClick={onOpenHandler}>
                    Open click
                </button>
            );
        };

        renderWithHub(<ButtonWithClick />);

        await user.click(screen.getByRole('button', { name: 'Open click' }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'From click' })).toBeInTheDocument();
        });
    });
});
