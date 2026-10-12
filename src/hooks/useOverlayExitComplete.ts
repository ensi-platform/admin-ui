import { useEffect, useRef } from 'react';

/**
 * Calls `onExitComplete` once after the overlay has been shown and then fully left
 * (`open === false` and `isExiting === false`), including when exit animation is skipped
 * or the overlay unmounts during exit. The unmount call is deferred by a tick so the
 * Strict Mode mount → cleanup → mount replay does not fire it.
 */
export const useOverlayExitComplete = (open: boolean, isExiting: boolean, onExitComplete?: () => void) => {
    const hadPresenceRef = useRef(false);
    const onExitCompleteRef = useRef(onExitComplete);
    const unmountTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    onExitCompleteRef.current = onExitComplete;

    if (open || isExiting) {
        hadPresenceRef.current = true;
    }

    useEffect(() => {
        if (!hadPresenceRef.current || open || isExiting) {
            return;
        }

        hadPresenceRef.current = false;
        onExitCompleteRef.current?.();
    }, [open, isExiting]);

    useEffect(() => {
        // Strict Mode replay: cancel the exit scheduled by the simulated unmount.
        clearTimeout(unmountTimerRef.current);

        return () => {
            // Defer so Strict Mode's mount → cleanup → mount does not remove a live overlay.
            unmountTimerRef.current = setTimeout(() => {
                if (!hadPresenceRef.current) {
                    return;
                }

                hadPresenceRef.current = false;
                onExitCompleteRef.current?.();
            }, 0);
        };
    }, []);
};
