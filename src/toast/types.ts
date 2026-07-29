import { type CSSProperties, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

export type TToastVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Props for `ToastProvider`. */
export interface IToastProviderProps {
    children: ReactNode;
    /**
     * Max simultaneously visible toasts. Defaults to `DEFAULT_MAX_VISIBLE_TOASTS`.
     * Applied once when the queue is created; changes after mount are ignored.
     */
    maxVisibleToasts?: number;
    /**
     * Auto-dismiss delay in ms when `appendToast` omits `options.timeout`.
     * Defaults to `DEFAULT_TIMEOUT`. Pass `0` for sticky by default.
     */
    defaultTimeout?: number;
}

/** Public context value returned by `useToast`. */
export interface IToastContextValue {
    appendToast: (content: IToastContent, options?: IToastAddOptions) => string;
    closeToast: (key: string) => void;
}

/** Props for the toast region (viewport stack). */
export interface IToastRegionProps extends IDataTestIdProps {
    /** Extra class on the region root. */
    className?: string;
    /** Inline styles on the region root (e.g. z-index override). */
    style?: CSSProperties;
}

/** Payload passed to `appendToast`. */
export interface IToastContent {
    /** Primary message. */
    title: string;
    /** Secondary message under the title. */
    description?: string;
    /** Semantic status variant. Defaults to `neutral`. */
    variant?: TToastVariant;
}

/** Options for `appendToast`. */
export interface IToastAddOptions {
    /** Auto-dismiss delay in ms. Overrides Provider `defaultTimeout`. Pass `0` to disable. */
    timeout?: number;
    /** Called when the toast is closed (timeout or close button). */
    onClose?: () => void;
}
