import { useMemo } from 'react';

import cn from 'classnames';
import { I18nProvider, useLocale } from 'react-aria-components';

import { AuiContext, defaultLabels } from './context.js';
import { type IAdminUiProviderProps, type IAuiContextValue, type TTextDirection } from './types.js';

import styles from './styles.module.css';

const AdminUiRoot = ({
    children,
    className,
    direction: directionProp,
    value,
    ...props
}: {
    children: IAdminUiProviderProps['children'];
    className?: string;
    direction?: TTextDirection;
    value: Omit<IAuiContextValue, 'direction'>;
} & Omit<IAdminUiProviderProps, 'children' | 'direction' | 'locale' | 'labels' | 'className'>) => {
    const { direction: localeDirection } = useLocale();
    const direction = directionProp ?? localeDirection;

    const contextValue = useMemo<IAuiContextValue>(
        () => ({
            ...value,
            direction,
        }),
        [value, direction]
    );

    return (
        <AuiContext.Provider value={contextValue}>
            <div {...props} className={cn(styles.root, className)} dir={direction}>
                {children}
            </div>
        </AuiContext.Provider>
    );
};

export const AdminUiProvider = ({
    children,
    direction,
    locale = 'ru-RU',
    labels: labelsProp,
    className,
    ...props
}: IAdminUiProviderProps) => {
    const value = useMemo(
        () => ({
            locale,
            labels: { ...defaultLabels, ...labelsProp },
        }),
        [locale, labelsProp]
    );

    return (
        <I18nProvider locale={locale}>
            <AdminUiRoot {...props} className={className} direction={direction} value={value}>
                {children}
            </AdminUiRoot>
        </I18nProvider>
    );
};
