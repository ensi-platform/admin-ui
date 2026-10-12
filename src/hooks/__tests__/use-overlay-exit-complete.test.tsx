import { StrictMode, type ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useOverlayExitComplete } from '../useOverlayExitComplete';

const StrictWrapper = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;

describe('useOverlayExitComplete', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('calls onExitComplete after open then fully closed', () => {
        const onExitComplete = vi.fn();

        const { rerender } = renderHook(
            ({ open, isExiting }) => useOverlayExitComplete(open, isExiting, onExitComplete),
            { initialProps: { open: true, isExiting: false } }
        );

        expect(onExitComplete).not.toHaveBeenCalled();

        rerender({ open: false, isExiting: true });
        expect(onExitComplete).not.toHaveBeenCalled();

        rerender({ open: false, isExiting: false });

        expect(onExitComplete).toHaveBeenCalledTimes(1);
    });

    it('does not call onExitComplete on unmount when never shown', () => {
        vi.useFakeTimers();
        const onExitComplete = vi.fn();

        const { unmount } = renderHook(() => useOverlayExitComplete(false, false, onExitComplete));

        unmount();
        vi.runAllTimers();

        expect(onExitComplete).not.toHaveBeenCalled();
    });

    it('calls onExitComplete on unmount while still present', () => {
        vi.useFakeTimers();
        const onExitComplete = vi.fn();

        const { unmount } = renderHook(() => useOverlayExitComplete(true, false, onExitComplete));

        unmount();

        expect(onExitComplete).not.toHaveBeenCalled();

        vi.runAllTimers();

        expect(onExitComplete).toHaveBeenCalledTimes(1);
    });

    it('does not call onExitComplete when Strict Mode replays the mount effect', () => {
        vi.useFakeTimers();
        const onExitComplete = vi.fn();

        renderHook(() => useOverlayExitComplete(true, false, onExitComplete), {
            wrapper: StrictWrapper,
        });

        vi.runAllTimers();

        expect(onExitComplete).not.toHaveBeenCalled();
    });
});
