import { useContext } from 'react';

import { ToastContext } from './context';
import { type IToastContextValue } from './types';

export const useToast = (): IToastContextValue => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('ToastProvider is required. Wrap the app with <ToastProvider>.');
    }

    return {
        appendToast: context.appendToast,
        closeToast: context.closeToast,
    };
};
