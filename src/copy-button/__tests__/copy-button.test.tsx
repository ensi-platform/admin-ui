import { type MouseEvent, type ReactElement } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { typographyStyles } from '@ds/typography';

import { AdminUiProvider } from '@/provider';

import { CopyButton } from '../index';

import styles from '../styles.module.css';

const writeText = vi.fn<(text: string) => Promise<void>>();

const renderButton = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('CopyButton', () => {
    afterEach(() => {
        vi.useRealTimers();
        writeText.mockReset();
    });

    it('copies the text and swaps the icon until the timeout', async () => {
        vi.useFakeTimers();
        writeText.mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

        renderButton(
            <CopyButton dataTestId="copy" timeout={1000}>
                123
            </CopyButton>
        );

        const button = screen.getByTestId('copy');

        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveClass(styles.root, typographyStyles.bodyS);
        expect(button).toHaveAccessibleName('Копировать 123');
        expect(button.querySelector('svg')).toHaveAttribute('viewBox', '0 0 256 256');
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        fireEvent.pointerEnter(button);
        fireEvent.click(button);
        await act(async () => {
            await Promise.resolve();
        });

        expect(writeText).toHaveBeenCalledWith('123');
        expect(button).toHaveAttribute('data-copied', 'true');
        expect(button.querySelector('svg')).toHaveAttribute('viewBox', '0 0 16 16');
        expect(button).toHaveAccessibleName('Скопировано: 123');
        expect(screen.getByRole('tooltip')).toHaveTextContent('Скопировано: 123');

        fireEvent.pointerLeave(button);

        expect(screen.getByRole('tooltip')).toHaveTextContent('Скопировано: 123');

        fireEvent.pointerEnter(button);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(button).not.toHaveAttribute('data-copied');
        expect(button.querySelector('svg')).toHaveAttribute('viewBox', '0 0 256 256');
        expect(button).toHaveAccessibleName('Копировать 123');
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(16);
        });

        expect(screen.getByRole('tooltip')).toHaveTextContent('Копировать');
        expect(screen.getByRole('tooltip')).not.toHaveTextContent('Скопировано');
    });

    it('does not reopen the hint when the pointer has left', async () => {
        vi.useFakeTimers();
        writeText.mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

        renderButton(<CopyButton timeout={1000}>123</CopyButton>);

        fireEvent.click(screen.getByRole('button', { name: 'Копировать 123' }));
        await act(async () => {
            await Promise.resolve();
        });

        fireEvent.pointerLeave(screen.getByRole('button', { name: 'Скопировано: 123' }));

        act(() => {
            vi.advanceTimersByTime(1016);
        });

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('clears the reopen timer on unmount', async () => {
        vi.useFakeTimers();
        writeText.mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

        const { unmount } = renderButton(<CopyButton timeout={1000}>123</CopyButton>);

        fireEvent.click(screen.getByRole('button', { name: 'Копировать 123' }));
        await act(async () => {
            await Promise.resolve();
        });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        unmount();

        act(() => {
            vi.advanceTimersByTime(16);
        });
    });

    it('ignores a focus open while the copied tooltip is closing', async () => {
        vi.useFakeTimers();
        writeText.mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

        renderButton(<CopyButton timeout={1000}>123</CopyButton>);

        const button = screen.getByRole('button', { name: 'Копировать 123' });

        fireEvent.click(button);
        await act(async () => {
            await Promise.resolve();
        });
        fireEvent.blur(button);
        fireEvent.pointerLeave(button);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        act(() => {
            button.focus();
        });

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('keeps the copied tip when focus returns during the status', async () => {
        writeText.mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });
        const user = userEvent.setup();

        renderButton(<CopyButton>123</CopyButton>);

        fireEvent.click(screen.getByRole('button', { name: 'Копировать 123' }));
        await act(async () => {
            await Promise.resolve();
        });

        fireEvent.blur(screen.getByRole('button', { name: 'Скопировано: 123' }));
        await user.hover(screen.getByRole('button', { name: 'Скопировано: 123' }));
        await user.tab();

        expect(screen.getByRole('tooltip')).toHaveTextContent('Скопировано: 123');
    });

    it('shows the copy hint on focus before a click', async () => {
        writeText.mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });
        const user = userEvent.setup();

        renderButton(<CopyButton>123</CopyButton>);

        await user.tab();

        expect(await screen.findByRole('tooltip')).toHaveTextContent('Копировать');

        await user.tab();

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('does not copy when the click is cancelled', async () => {
        writeText.mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

        renderButton(
            <CopyButton
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                }}
            >
                123
            </CopyButton>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Копировать 123' }));
        await act(async () => {
            await Promise.resolve();
        });

        expect(writeText).not.toHaveBeenCalled();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('shows a tooltip and keeps the copy icon when the clipboard rejects', async () => {
        writeText.mockRejectedValue(new Error('denied'));
        Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

        renderButton(<CopyButton dataTestId="copy">123</CopyButton>);

        fireEvent.click(screen.getByTestId('copy'));
        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByTestId('copy')).toHaveAttribute('data-failed', 'true');
        expect(screen.getByTestId('copy').querySelector('svg')).toHaveAttribute('viewBox', '0 0 256 256');
        expect(screen.getByRole('tooltip')).toHaveTextContent('Не удалось скопировать');
    });
});
