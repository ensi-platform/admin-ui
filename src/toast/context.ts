import { createContext } from 'react';

import { type UNSTABLE_ToastQueue } from 'react-aria-components';

import { type IToastContent, type IToastContextValue } from './types';

export interface IToastContextInternal extends IToastContextValue {
    queue: UNSTABLE_ToastQueue<IToastContent>;
}

export const ToastContext = createContext<IToastContextInternal | null>(null);
