import { type ReactNode } from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { DEFAULT_MAX_VISIBLE_TOASTS } from '../constants';
import { ToastProvider, ToastRegion, useToast } from '../index';
import { type IToastAddOptions, type IToastContent, type IToastContextValue } from '../types';

import styles from '../styles.module.css';

const CLOSE_LABEL = 'Закрыть';

let toastApi: IToastContextValue | null = null;

const ToastApiCapture = () => {
    toastApi = useToast();
    return null;
};

const ToastHarness = ({
    children,
    dataTestId,
    defaultTimeout,
    maxVisibleToasts,
}: {
    children?: ReactNode;
    dataTestId?: string;
    defaultTimeout?: number;
    maxVisibleToasts?: number;
}) => (
    <AdminUiProvider labels={{ close: CLOSE_LABEL }}>
        <ToastProvider maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <ToastApiCapture />
            {children}
            <ToastRegion dataTestId={dataTestId} />
        </ToastProvider>
    </AdminUiProvider>
);

const appendToast = (content: IToastContent, options?: IToastAddOptions): string => {
    if (!toastApi) {
        throw new Error('Toast API is not ready');
    }

    return toastApi.appendToast(content, options);
};

const closeToast = (key: string): void => {
    if (!toastApi) {
        throw new Error('Toast API is not ready');
    }

    toastApi.closeToast(key);
};

const getToastRoot = (title: string) => screen.getByText(title).closest(`.${styles.root}`);

describe('Toast', () => {
    beforeEach(() => {
        toastApi = null;
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        toastApi = null;
        vi.useRealTimers();
    });

    it('renders title after appendToast', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Сохранено' });
        });

        expect(screen.getByRole('alertdialog')).toHaveTextContent('Сохранено');
    });

    it('renders description when provided', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({
                title: 'Заголовок',
                description: 'Подробности операции',
            });
        });

        expect(screen.getByText('Подробности операции')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Только заголовок' });
        });

        expect(screen.getByText('Только заголовок')).toBeInTheDocument();
        expect(screen.queryByText('Подробности операции')).not.toBeInTheDocument();
    });

    it('applies success variant class on toast root', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Успех', variant: 'success' });
        });

        expect(getToastRoot('Успех')).toHaveClass(styles.success);
    });

    it('applies danger variant class on toast root', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Ошибка', variant: 'danger' });
        });

        expect(getToastRoot('Ошибка')).toHaveClass(styles.danger);
    });

    it.each([
        ['warning', styles.warning],
        ['info', styles.info],
    ] as const)('applies %s variant class on toast root', (variant, className) => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: variant, variant });
        });

        expect(getToastRoot(variant)).toHaveClass(className);
    });

    it('uses neutral variant by default', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'По умолчанию' });
        });

        expect(getToastRoot('По умолчанию')).toHaveClass(styles.neutral);
    });

    it('sets data-test-id on region from dataTestId', () => {
        render(<ToastHarness dataTestId="toast-region" />);

        act(() => {
            appendToast({ title: 'С test id' });
        });

        expect(screen.getByTestId('toast-region')).toBeInTheDocument();
    });

    it('closes toast when close button is clicked', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Закрываемый' });
        });

        expect(screen.getByText('Закрываемый')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: CLOSE_LABEL }));

        expect(screen.queryByText('Закрываемый')).not.toBeInTheDocument();
    });

    it('closes toast when closeToast is called with key', () => {
        render(<ToastHarness />);

        let key = '';
        act(() => {
            key = appendToast({ title: 'По ключу' });
        });

        expect(screen.getByText('По ключу')).toBeInTheDocument();

        act(() => {
            closeToast(key);
        });

        expect(screen.queryByText('По ключу')).not.toBeInTheDocument();
    });

    it('dismisses toast after default timeout of 5000ms', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Автозакрытие' });
        });

        expect(screen.getByText('Автозакрытие')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(4999);
        });

        expect(screen.getByText('Автозакрытие')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(screen.queryByText('Автозакрытие')).not.toBeInTheDocument();
    });

    it('uses defaultTimeout from Provider when options.timeout is omitted', () => {
        render(<ToastHarness defaultTimeout={1000} />);

        act(() => {
            appendToast({ title: 'Provider timeout' });
        });

        act(() => {
            vi.advanceTimersByTime(999);
        });

        expect(screen.getByText('Provider timeout')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(screen.queryByText('Provider timeout')).not.toBeInTheDocument();
    });

    it('per-call timeout overrides Provider defaultTimeout', () => {
        render(<ToastHarness defaultTimeout={1000} />);

        act(() => {
            appendToast({ title: 'Override timeout' }, { timeout: 3000 });
        });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('Override timeout')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.queryByText('Override timeout')).not.toBeInTheDocument();
    });

    it('respects custom timeout', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Свой таймаут' }, { timeout: 8000 });
        });

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByText('Свой таймаут')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(screen.queryByText('Свой таймаут')).not.toBeInTheDocument();
    });

    it('does not auto-dismiss when timeout is 0', () => {
        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Sticky' }, { timeout: 0 });
        });

        act(() => {
            vi.advanceTimersByTime(10_000);
        });

        expect(screen.getByText('Sticky')).toBeInTheDocument();
    });

    it('calls onClose when toast is closed via button', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onClose = vi.fn();

        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Колбэк' }, { onClose });
        });

        await user.click(screen.getByRole('button', { name: CLOSE_LABEL }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when toast is dismissed by timeout', () => {
        const onClose = vi.fn();

        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Таймаут колбэк' }, { onClose });
        });

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when toast is closed via closeToast(key)', () => {
        const onClose = vi.fn();

        render(<ToastHarness />);

        let key = '';
        act(() => {
            key = appendToast({ title: 'Колбэк close' }, { onClose });
        });

        act(() => {
            closeToast(key);
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it(`limits visible toasts to ${DEFAULT_MAX_VISIBLE_TOASTS}`, () => {
        render(<ToastHarness />);

        act(() => {
            for (let i = 1; i <= DEFAULT_MAX_VISIBLE_TOASTS + 1; i += 1) {
                appendToast({ title: `Тост ${i}` }, { timeout: 0 });
            }
        });

        expect(screen.getAllByRole('alertdialog')).toHaveLength(DEFAULT_MAX_VISIBLE_TOASTS);
        expect(screen.queryByText('Тост 1')).not.toBeInTheDocument();
        expect(screen.getByText('Тост 2')).toBeInTheDocument();
        expect(screen.getByText(`Тост ${DEFAULT_MAX_VISIBLE_TOASTS + 1}`)).toBeInTheDocument();
    });

    it('limits visible toasts to maxVisibleToasts prop', () => {
        render(<ToastHarness maxVisibleToasts={2} />);

        act(() => {
            for (let i = 1; i <= 3; i += 1) {
                appendToast({ title: `Лимит ${i}` }, { timeout: 0 });
            }
        });

        expect(screen.getAllByRole('alertdialog')).toHaveLength(2);
        expect(screen.queryByText('Лимит 1')).not.toBeInTheDocument();
        expect(screen.getByText('Лимит 2')).toBeInTheDocument();
        expect(screen.getByText('Лимит 3')).toBeInTheDocument();
    });

    it('throws when useToast is used without ToastProvider', () => {
        const Broken = () => {
            useToast();
            return null;
        };

        expect(() => render(<Broken />)).toThrow('ToastProvider is required. Wrap the app with <ToastProvider>.');
    });

    describe('wrapUpdate / view transitions', () => {
        const originalMatchMedia = window.matchMedia;
        const originalStartViewTransition = (document as Document & { startViewTransition?: unknown })
            .startViewTransition;

        const mockMatchMedia = (matchesReducedMotion: boolean) => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                configurable: true,
                value: vi.fn((query: string) => ({
                    matches: matchesReducedMotion && query === '(prefers-reduced-motion: reduce)',
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });
        };

        const mockStartViewTransition = () => {
            const startViewTransition = vi.fn((callback: () => void) => {
                callback();
                return {
                    finished: Promise.resolve(),
                    ready: Promise.resolve(),
                    updateCallbackDone: Promise.resolve(),
                    skipTransition: vi.fn(),
                };
            });

            Object.defineProperty(document, 'startViewTransition', {
                writable: true,
                configurable: true,
                value: startViewTransition,
            });

            return startViewTransition;
        };

        afterEach(() => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                configurable: true,
                value: originalMatchMedia,
            });

            if (originalStartViewTransition === undefined) {
                Reflect.deleteProperty(document, 'startViewTransition');
                return;
            }
            Object.defineProperty(document, 'startViewTransition', {
                writable: true,
                configurable: true,
                value: originalStartViewTransition,
            });
        });

        it('skips startViewTransition when prefers-reduced-motion', () => {
            mockMatchMedia(true);
            const startViewTransition = mockStartViewTransition();

            render(<ToastHarness />);

            let key = '';
            act(() => {
                key = appendToast({ title: 'Reduced motion' }, { timeout: 0 });
            });

            expect(screen.getByText('Reduced motion')).toBeInTheDocument();
            expect(startViewTransition).not.toHaveBeenCalled();

            act(() => {
                closeToast(key);
            });

            expect(screen.queryByText('Reduced motion')).not.toBeInTheDocument();
            expect(startViewTransition).not.toHaveBeenCalled();
        });

        it('uses startViewTransition when motion is allowed', () => {
            mockMatchMedia(false);
            const startViewTransition = mockStartViewTransition();

            render(<ToastHarness />);

            act(() => {
                appendToast({ title: 'With VT' }, { timeout: 0 });
            });

            expect(screen.getByText('With VT')).toBeInTheDocument();
            expect(startViewTransition).toHaveBeenCalled();
        });
    });

    it('pauses auto-dismiss while toast is hovered', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        render(<ToastHarness />);

        act(() => {
            appendToast({ title: 'Hover pause' }, { timeout: 5000 });
        });

        const toastRoot = getToastRoot('Hover pause');
        expect(toastRoot).toBeInstanceOf(HTMLElement);
        if (!(toastRoot instanceof HTMLElement)) {
            return;
        }

        await user.hover(toastRoot);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByText('Hover pause')).toBeInTheDocument();

        await user.unhover(toastRoot);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.queryByText('Hover pause')).not.toBeInTheDocument();
    });

    it('pauses auto-dismiss while toast is focused', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        render(
            <ToastHarness>
                <button type="button">Outside</button>
            </ToastHarness>
        );

        act(() => {
            appendToast({ title: 'Focus pause' }, { timeout: 5000 });
        });

        const toastRoot = getToastRoot('Focus pause');
        expect(toastRoot).toBeInstanceOf(HTMLElement);
        if (!(toastRoot instanceof HTMLElement)) {
            return;
        }

        act(() => {
            toastRoot.focus();
        });

        expect(toastRoot).toHaveFocus();

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByText('Focus pause')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Outside' }));

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.queryByText('Focus pause')).not.toBeInTheDocument();
    });
});
