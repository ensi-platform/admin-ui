import { createRef, useState, type MouseEvent } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { BottomSheet } from '../index';
import { type IBottomSheetProps } from '../types';
import { shouldCloseSheet } from '../utils';

import styles from '../styles.module.css';

const BottomSheetHarness = ({
    open: openProp = true,
    onOpenChange,
    closeButtonOnClick,
    ...props
}: Omit<IBottomSheetProps, 'open' | 'onOpenChange' | 'children'> & {
    open?: boolean;
    onOpenChange?: IBottomSheetProps['onOpenChange'];
    closeButtonOnClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
    const [open, setOpen] = useState(openProp);

    return (
        <AdminUiProvider labels={{ close: 'Закрыть' }}>
            <BottomSheet
                {...props}
                open={open}
                onOpenChange={next => {
                    setOpen(next);
                    onOpenChange?.(next);
                }}
            >
                <BottomSheet.Header>
                    <BottomSheet.Title>Заголовок</BottomSheet.Title>
                    <BottomSheet.CloseButton dataTestId="bottom-sheet-close" onClick={closeButtonOnClick} />
                </BottomSheet.Header>
                <BottomSheet.Body>Контент</BottomSheet.Body>
                <BottomSheet.Footer>
                    <button type="button">OK</button>
                </BottomSheet.Footer>
            </BottomSheet>
        </AdminUiProvider>
    );
};

const dispatchPointer = (
    target: Element,
    type: 'pointerdown' | 'pointermove' | 'pointerup',
    init: Partial<PointerEventInit> & { clientY: number; timeStamp?: number }
) => {
    const { timeStamp = 0, ...rest } = init;
    const event = new PointerEvent(type, {
        pointerId: 1,
        button: 0,
        bubbles: true,
        clientX: 0,
        ...rest,
    });
    Object.defineProperty(event, 'timeStamp', { value: timeStamp });
    target.dispatchEvent(event);
};

describe('BottomSheet', () => {
    it('renders dialog when open', () => {
        render(<BottomSheetHarness open dataTestId="bottom-sheet" />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
    });

    it('does not render dialog when closed', () => {
        render(<BottomSheetHarness open={false} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('applies variant class', () => {
        render(<BottomSheetHarness open variant="primary" />);

        expect(document.body.querySelector(`.${styles.primary}`)).toBeInTheDocument();
    });

    it('applies fullscreen class', () => {
        render(<BottomSheetHarness open fullscreen />);

        expect(document.body.querySelector(`.${styles.fullscreen}`)).toBeInTheDocument();
    });

    it('calls onOpenChange when close button is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<BottomSheetHarness open onOpenChange={onOpenChange} />);

        await user.click(screen.getByTestId('bottom-sheet-close'));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange on Escape when keyboardDismissable', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<BottomSheetHarness open onOpenChange={onOpenChange} />);

        await user.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('assigns object and callback refs to the panel', () => {
        const objectRef = createRef<HTMLDivElement>();
        const callbackRef = vi.fn();

        const { rerender } = render(<BottomSheetHarness open ref={objectRef} />);

        expect(objectRef.current).toBeInstanceOf(HTMLElement);

        rerender(<BottomSheetHarness open ref={callbackRef} />);

        expect(callbackRef).toHaveBeenCalled();
        expect(callbackRef.mock.calls.at(-1)?.[0]).toBeInstanceOf(HTMLElement);
    });

    it('throws when Body is used outside BottomSheet', () => {
        expect(() => render(<BottomSheet.Body>Outside</BottomSheet.Body>)).toThrow(
            'useBottomSheetContext must be used within BottomSheet'
        );
    });

    it('does not close when CloseButton onClick calls preventDefault', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <BottomSheetHarness
                open
                onOpenChange={onOpenChange}
                closeButtonOnClick={event => {
                    event.preventDefault();
                }}
            />
        );

        await user.click(screen.getByTestId('bottom-sheet-close'));

        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange on swipe close', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: vi.fn((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        const onOpenChange = vi.fn();

        render(<BottomSheetHarness open onOpenChange={onOpenChange} />);

        const panel = document.body.querySelector(`.${styles.panel}`);
        expect(panel).toBeInstanceOf(HTMLElement);
        if (!(panel instanceof HTMLElement)) {
            return;
        }

        vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 400,
            right: 300,
            width: 300,
            height: 400,
            toJSON: () => ({}),
        });
        panel.setPointerCapture = vi.fn();
        panel.releasePointerCapture = vi.fn();
        panel.hasPointerCapture = vi.fn(() => true);

        const handle = panel.querySelector(`.${styles.handle}`);
        expect(handle).toBeInstanceOf(HTMLElement);
        if (!(handle instanceof HTMLElement)) {
            return;
        }

        dispatchPointer(handle, 'pointerdown', { clientY: 0, timeStamp: 0 });
        dispatchPointer(handle, 'pointermove', { clientY: 10, timeStamp: 50 });
        dispatchPointer(handle, 'pointermove', { clientY: 200, timeStamp: 1000 });
        dispatchPointer(handle, 'pointerup', { clientY: 200, timeStamp: 2000 });

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});

describe('shouldCloseSheet', () => {
    it('closes by distance past threshold', () => {
        expect(
            shouldCloseSheet({
                deltaY: 200,
                height: 400,
                velocity: 0,
                swipeStartOffset: 0,
            })
        ).toBe(true);
    });

    it('does not close below distance threshold without velocity', () => {
        expect(
            shouldCloseSheet({
                deltaY: 100,
                height: 400,
                velocity: 0,
                swipeStartOffset: 0,
            })
        ).toBe(false);
    });

    it('closes by velocity', () => {
        expect(
            shouldCloseSheet({
                deltaY: 40,
                height: 400,
                velocity: 0.5,
                swipeStartOffset: 0,
            })
        ).toBe(true);
    });

    it('uses higher velocity threshold after scroll handoff', () => {
        expect(
            shouldCloseSheet({
                deltaY: 40,
                height: 400,
                velocity: 0.5,
                swipeStartOffset: 20,
            })
        ).toBe(false);

        expect(
            shouldCloseSheet({
                deltaY: 40,
                height: 400,
                velocity: 2.5,
                swipeStartOffset: 20,
            })
        ).toBe(true);
    });
});
