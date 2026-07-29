import { flushSync } from 'react-dom';

import { UNSTABLE_ToastQueue } from 'react-aria-components';

import { type IToastContent } from './types';

const wrapUpdate = (fn: () => void): void => {
    const reduced =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced && typeof document !== 'undefined' && 'startViewTransition' in document) {
        document.startViewTransition(() => {
            flushSync(fn);
        });
        return;
    }

    fn();
};

export const createToastQueue = (maxVisibleToasts: number): UNSTABLE_ToastQueue<IToastContent> =>
    new UNSTABLE_ToastQueue<IToastContent>({
        maxVisibleToasts,
        wrapUpdate,
    });
