import { createRef, useState, type MouseEvent } from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/button';
import { Popover } from '@/popover';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { Modal } from '../index';
import { type IModalProps } from '../types';

import styles from '../styles.module.css';

const ModalHarness = ({
    open: openProp = true,
    onOpenChange,
    closeButtonOnClick,
    ...props
}: Omit<IModalProps, 'open' | 'onOpenChange' | 'children'> & {
    open?: boolean;
    onOpenChange?: IModalProps['onOpenChange'];
    closeButtonOnClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
    const [open, setOpen] = useState(openProp);

    return (
        <AdminUiProvider labels={{ close: 'Закрыть' }}>
            <Modal
                {...props}
                open={open}
                onOpenChange={next => {
                    setOpen(next);
                    onOpenChange?.(next);
                }}
            >
                <Modal.Header>
                    <Modal.Title>Заголовок</Modal.Title>
                    <Modal.CloseButton dataTestId="modal-close" onClick={closeButtonOnClick} />
                </Modal.Header>
                <Modal.Body>Контент</Modal.Body>
                <Modal.Footer>
                    <button type="button">OK</button>
                </Modal.Footer>
            </Modal>
        </AdminUiProvider>
    );
};

describe('Modal', () => {
    it('portals the dialog inside the provider root', () => {
        render(
            <AdminUiProvider data-test-id="aui-root">
                <Modal open>
                    <Modal.Header>
                        <Modal.Title>Заголовок</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Контент</Modal.Body>
                </Modal>
            </AdminUiProvider>
        );

        expect(screen.getByTestId('aui-root')).toContainElement(screen.getByRole('dialog'));
    });

    it('keeps the dialog inside the provider root after an update', () => {
        const { rerender } = render(
            <AdminUiProvider data-test-id="aui-root" locale="ru-RU">
                <Modal open>
                    <Modal.Header>
                        <Modal.Title>Заголовок</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Контент</Modal.Body>
                </Modal>
            </AdminUiProvider>
        );

        rerender(
            <AdminUiProvider data-test-id="aui-root" locale="en-US">
                <Modal open>
                    <Modal.Header>
                        <Modal.Title>Заголовок</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Контент</Modal.Body>
                </Modal>
            </AdminUiProvider>
        );

        expect(screen.getByTestId('aui-root')).toContainElement(screen.getByRole('dialog'));
    });

    it('renders dialog when open', () => {
        render(<ModalHarness open dataTestId="modal" />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
    });

    it('keeps Tab inside the dialog', async () => {
        const user = userEvent.setup();
        render(<ModalHarness open />);

        const dialog = screen.getByRole('dialog');
        await user.tab();
        expect(dialog.contains(document.activeElement)).toBe(true);
        await user.tab();
        expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it('does not render dialog when closed', () => {
        render(<ModalHarness open={false} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        render(<ModalHarness open size="sm" variant="primary" />);

        expect(document.body.querySelector(`.${styles.sm}`)).toBeInTheDocument();
        expect(document.body.querySelector(`.${styles.primary}`)).toBeInTheDocument();
    });

    it('applies fullscreen class', () => {
        render(<ModalHarness open fullscreen />);

        expect(document.body.querySelector(`.${styles.fullscreen}`)).toBeInTheDocument();
    });

    it('calls onOpenChange when close button is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<ModalHarness open onOpenChange={onOpenChange} />);

        await user.click(screen.getByTestId('modal-close'));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not close when CloseButton onClick calls preventDefault', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <ModalHarness
                open
                onOpenChange={onOpenChange}
                closeButtonOnClick={event => {
                    event.preventDefault();
                }}
            />
        );

        await user.click(screen.getByTestId('modal-close'));

        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange on Escape when keyboardDismissable', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<ModalHarness open onOpenChange={onOpenChange} />);

        await user.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not close on Escape when keyboardDismissable is false', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<ModalHarness open onOpenChange={onOpenChange} keyboardDismissable={false} />);

        await user.keyboard('{Escape}');

        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes on outside click and stays open when dismissable is false', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        const { unmount } = render(<ModalHarness open onOpenChange={onOpenChange} />);

        await user.click(document.querySelector('[data-testid="underlay"]') as HTMLElement);

        expect(onOpenChange).toHaveBeenCalledWith(false);
        unmount();

        onOpenChange.mockClear();
        render(<ModalHarness open onOpenChange={onOpenChange} dismissable={false} />);

        await user.click(document.querySelector('[data-testid="underlay"]') as HTMLElement);

        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('moves focus into the dialog and returns it to the opener', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [open, setOpen] = useState(false);

            return (
                <AdminUiProvider>
                    <button type="button" onClick={() => setOpen(true)}>
                        Open
                    </button>
                    <Modal open={open} onOpenChange={setOpen}>
                        <Modal.Header>
                            <Modal.Title>Заголовок</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <button type="button">Inside</button>
                        </Modal.Body>
                    </Modal>
                </AdminUiProvider>
            );
        };

        render(<Harness />);

        const opener = screen.getByRole('button', { name: 'Open' });

        await user.click(opener);

        const dialog = screen.getByRole('dialog');

        await waitFor(() => {
            expect(dialog.contains(document.activeElement)).toBe(true);
        });

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(opener).toHaveFocus();
        });
    });

    it('Escape closes a nested popover and leaves the modal open', async () => {
        const user = userEvent.setup();

        render(
            <AdminUiProvider>
                <Modal open>
                    <Modal.Body>
                        <Popover>
                            <Popover.Trigger>
                                <Button>Open</Button>
                            </Popover.Trigger>
                            <Popover.Content>Внутри</Popover.Content>
                        </Popover>
                    </Modal.Body>
                </Modal>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByText('Внутри')).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.queryByText('Внутри')).not.toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('names the close button from provider labels', () => {
        render(<ModalHarness open />);

        expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
    });

    it('points ref at the panel', () => {
        const ref = createRef<HTMLDivElement>();

        render(
            <AdminUiProvider>
                <Modal open ref={ref}>
                    <Modal.Header>
                        <Modal.Title>Заголовок</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Контент</Modal.Body>
                </Modal>
            </AdminUiProvider>
        );

        expect(ref.current).toContainElement(screen.getByRole('dialog'));
    });

    it('calls onExitComplete once after close and not while the dialog stays open', async () => {
        const user = userEvent.setup();
        const onExitComplete = vi.fn();

        render(<ModalHarness open onExitComplete={onExitComplete} />);

        await act(async () => {
            await new Promise(resolve => {
                setTimeout(resolve, 0);
            });
        });

        expect(onExitComplete).not.toHaveBeenCalled();

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(onExitComplete).toHaveBeenCalledTimes(1);
        });
    });

    it('does not finish exit when the parent keeps the dialog open', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        const onExitComplete = vi.fn();

        render(
            <AdminUiProvider>
                <Modal open onOpenChange={onOpenChange} onExitComplete={onExitComplete}>
                    <Modal.Header>
                        <Modal.Title>Заголовок</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Контент</Modal.Body>
                </Modal>
            </AdminUiProvider>
        );

        await user.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await act(async () => {
            await new Promise(resolve => {
                setTimeout(resolve, 0);
            });
        });

        expect(onExitComplete).not.toHaveBeenCalled();
    });

    it('has no axe violations when open', async () => {
        const { container } = render(<ModalHarness open />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
