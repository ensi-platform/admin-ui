import { type ComponentPropsWithRef, type ReactNode } from 'react';

export type TTextDirection = 'ltr' | 'rtl';

export interface IAuiLabels {
    close: string;
    clear: string;
}

export type TAuiLabels = IAuiLabels;

export interface IAuiContextValue {
    locale: string;
    direction: TTextDirection;
    labels: IAuiLabels;
}

export interface IAdminUiProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'dir'> {
    children: ReactNode;
    direction?: TTextDirection;
    locale?: string;
    labels?: Partial<IAuiLabels>;
}
