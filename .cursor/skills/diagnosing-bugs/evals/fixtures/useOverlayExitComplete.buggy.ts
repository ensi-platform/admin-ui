import { useEffect, useRef } from 'react';

/**
 * Calls `onExitComplete` once after the overlay has been shown and then fully left
 * (`open === false` and `isExiting === false`), including when exit animation is skipped
 * or the overlay unmounts during exit.
 */
export const useOverlayExitComplete = (open: boolean, isExiting: boolean, onExitComplete?: () => void) => {
    const hadPresenceRef = useRef(false);
    const onExitCompleteRef = useRef(onExitComplete);
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

    useEffect(
        () => () => {
            if (!hadPresenceRef.current) {
                return;
            }

            hadPresenceRef.current = false;
            onExitCompleteRef.current?.();
        },
        []
    );
};
