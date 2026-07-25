import { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Modal } from '../index';
import { type IModalProps } from '../types';

import styles from '../styles.module.css';

const ModalHarness = ({
    open: openProp = true,
    onOpenChange,
    ...props
}: Omit<IModalProps, 'open' | 'onOpenChange' | 'children'> & {
    open?: boolean;
    onOpenChange?: IModalProps['onOpenChange'];
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
                    <Modal.CloseButton dataTestId="modal-close" />
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
    it('renders dialog when open', () => {
        render(<ModalHarness open dataTestId="modal" />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
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
});
