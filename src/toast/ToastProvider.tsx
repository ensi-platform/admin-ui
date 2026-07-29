import { useCallback, useMemo, useRef, useState } from 'react';

import { DEFAULT_MAX_VISIBLE_TOASTS, DEFAULT_TIMEOUT } from './constants';
import { ToastContext } from './context';
import { createToastQueue } from './queue';
import { type IToastAddOptions, type IToastContent, type IToastProviderProps } from './types';

export const ToastProvider = ({ children, maxVisibleToasts, defaultTimeout }: IToastProviderProps) => {
    const [queue] = useState(() => createToastQueue(maxVisibleToasts ?? DEFAULT_MAX_VISIBLE_TOASTS));

    const defaultTimeoutRef = useRef(defaultTimeout ?? DEFAULT_TIMEOUT);
    defaultTimeoutRef.current = defaultTimeout ?? DEFAULT_TIMEOUT;

    const appendToast = useCallback(
        (content: IToastContent, options?: IToastAddOptions): string =>
            queue.add(content, {
                ...options,
                timeout: options?.timeout ?? defaultTimeoutRef.current,
            }),
        [queue]
    );

    const closeToast = useCallback(
        (key: string): void => {
            queue.close(key);
        },
        [queue]
    );

    const value = useMemo(
        () => ({
            queue,
            appendToast,
            closeToast,
        }),
        [queue, appendToast, closeToast]
    );

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

ToastProvider.displayName = 'ToastProvider';
