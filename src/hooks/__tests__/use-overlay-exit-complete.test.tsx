import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOverlayExitComplete } from '../useOverlayExitComplete';

describe('useOverlayExitComplete', () => {
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
        const onExitComplete = vi.fn();

        const { unmount } = renderHook(() => useOverlayExitComplete(false, false, onExitComplete));

        unmount();

        expect(onExitComplete).not.toHaveBeenCalled();
    });

    it('calls onExitComplete on unmount while still present', () => {
        const onExitComplete = vi.fn();

        const { unmount } = renderHook(() => useOverlayExitComplete(true, false, onExitComplete));

        unmount();

        expect(onExitComplete).toHaveBeenCalledTimes(1);
    });
});
