import { type MouseEventHandler, type ReactNode } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '@/modal';
import { AdminUiProvider } from '@/provider';

import { ModalHub } from '../ModalHub';
import { ModalProvider } from '../ModalProvider';
import { type IModalHubItemProps } from '../types';
import { useModalAsync } from '../useModalAsync';

type TAsyncModalProps = IModalHubItemProps & { title?: string };

const AsyncModal = ({ open, onOpenChange, onExitComplete, title = 'Async modal' }: TAsyncModalProps) => (
    <Modal open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete} dataTestId="async-modal">
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.CloseButton dataTestId="async-modal-close" />
        </Modal.Header>
        <Modal.Body>Body</Modal.Body>
    </Modal>
);

const loadAsyncModal = () => Promise.resolve({ default: AsyncModal });

const OpenAsyncButton = () => {
    const { onOpenHandler } = useModalAsync<TAsyncModalProps>({
        loadComponent: loadAsyncModal,
        props: { title: 'Lazy title' },
    });

    return (
        <button type="button" onClick={() => onOpenHandler()}>
            Open async
        </button>
    );
};

const OpenAsyncWithOverrideButton = () => {
    const { onOpenHandler } = useModalAsync<TAsyncModalProps>({
        loadComponent: loadAsyncModal,
        props: { title: 'Base title' },
    });

    return (
        <button type="button" onClick={() => onOpenHandler({ title: 'Override title' })}>
            Open override
        </button>
    );
};

const OpenCloseAsyncButtons = ({
    onOpenChange,
}: {
    onOpenChange?: IModalHubItemProps['onOpenChange'];
} = {}) => {
    const { onOpenHandler, onCloseHandler } = useModalAsync<TAsyncModalProps>({
        loadComponent: loadAsyncModal,
        props: { title: 'Closeable async', onOpenChange },
    });

    return (
        <>
            <button type="button" onClick={() => onOpenHandler()}>
                Open async
            </button>
            <button type="button" data-test-id="close-via-hook" onClick={onCloseHandler}>
                Close via hook
            </button>
        </>
    );
};

const ReopenAsyncButton = () => {
    const { onOpenHandler } = useModalAsync<TAsyncModalProps>({
        loadComponent: loadAsyncModal,
        props: { title: 'Reopen async' },
    });

    return (
        <button type="button" data-test-id="reopen-async" onClick={() => onOpenHandler()}>
            Reopen async
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
            const { onOpenHandler } = useModalAsync<TAsyncModalProps>({
                loadComponent: (): Promise<{ default: typeof AsyncModal }> => {
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
            const { onOpenHandler } = useModalAsync<TAsyncModalProps>({
                loadComponent,
                props: { title: 'From click' },
            });

            return (
                <button type="button" onClick={onOpenHandler as unknown as MouseEventHandler<HTMLButtonElement>}>
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

    it('closes via onCloseHandler', async () => {
        const user = userEvent.setup();

        renderWithHub(<OpenCloseAsyncButtons />);

        await user.click(screen.getByRole('button', { name: 'Open async' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('close-via-hook'));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('onCloseHandler is a no-op before open', () => {
        renderWithHub(<OpenCloseAsyncButtons />);

        fireEvent.click(screen.getByTestId('close-via-hook'));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls props.onOpenChange(false) from onCloseHandler', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        renderWithHub(<OpenCloseAsyncButtons onOpenChange={onOpenChange} />);

        await user.click(screen.getByRole('button', { name: 'Open async' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('close-via-hook'));

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it('closes previous modal when reopening after load', async () => {
        renderWithHub(<ReopenAsyncButton />);

        fireEvent.click(screen.getByTestId('reopen-async'));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('reopen-async'));

        await waitFor(() => {
            expect(screen.getAllByRole('dialog')).toHaveLength(1);
        });
    });

    it('does not open modal when loadComponent rejects', async () => {
        const user = userEvent.setup();
        const loadError = new Error('load failed');

        const RejectButton = () => {
            const { onOpenHandler } = useModalAsync<TAsyncModalProps>({
                loadComponent: (): Promise<{ default: typeof AsyncModal }> => Promise.reject(loadError),
                props: { title: 'Should not open' },
            });

            return (
                <button type="button" onClick={() => onOpenHandler()}>
                    Open reject
                </button>
            );
        };

        renderWithHub(<RejectButton />);

        await user.click(screen.getByRole('button', { name: 'Open reject' }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('ignores stale load rejection after a newer open', async () => {
        let rejectFirst!: (reason?: unknown) => void;
        let resolveSecond!: (value: { default: typeof AsyncModal }) => void;
        let loadCount = 0;

        const StaleRejectButton = () => {
            const { onOpenHandler } = useModalAsync<TAsyncModalProps>({
                loadComponent: (): Promise<{ default: typeof AsyncModal }> => {
                    loadCount += 1;

                    if (loadCount === 1) {
                        return new Promise((_, reject) => {
                            rejectFirst = reject;
                        });
                    }

                    return new Promise(resolve => {
                        resolveSecond = resolve;
                    });
                },
                props: { title: 'Stale reject' },
            });

            return (
                <button type="button" data-test-id="stale-reject" onClick={() => onOpenHandler()}>
                    Stale reject
                </button>
            );
        };

        renderWithHub(<StaleRejectButton />);

        fireEvent.click(screen.getByTestId('stale-reject'));
        fireEvent.click(screen.getByTestId('stale-reject'));

        rejectFirst(new Error('stale'));
        resolveSecond({ default: AsyncModal });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Stale reject' })).toBeInTheDocument();
        });
    });
});
