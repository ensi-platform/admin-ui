import { type ComponentPropsWithRef, type ReactNode } from 'react';

export type TTextDirection = 'ltr' | 'rtl';

/** Built-in a11y / UI label strings. */
export interface IAuiLabels {
    close: string;
    clear: string;
}

export type TAuiLabels = IAuiLabels;

/** Admin UI context value. */
export interface IAuiContextValue {
    locale: string;
    direction: TTextDirection;
    labels: IAuiLabels;
}

export interface IAdminUiProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'dir'> {
    children: ReactNode;
    /** Text direction. Defaults to `ltr`. */
    direction?: TTextDirection;
    /** BCP 47 locale. */
    locale?: string;
    /** Partial override of built-in labels. */
    labels?: Partial<IAuiLabels>;
}
