import { useMemo, useState } from 'react';

import cn from 'classnames';
import { UNSAFE_PortalProvider as PortalProvider } from 'react-aria';
import { I18nProvider, useLocale } from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import { AuiContext, defaultLabels } from './context';
import { type IAdminUiProviderProps, type IAuiContextValue, type TTextDirection } from './types';

import styles from './styles.module.css';

const AdminUiRoot = ({
    children,
    className,
    direction: directionProp,
    value,
    ref,
    ...props
}: {
    children: IAdminUiProviderProps['children'];
    className?: string;
    direction?: TTextDirection;
    value: Omit<IAuiContextValue, 'direction'>;
} & Omit<IAdminUiProviderProps, 'children' | 'direction' | 'locale' | 'labels' | 'className'>) => {
    const { direction: localeDirection } = useLocale();
    const direction = directionProp ?? localeDirection;
    const [portalEl, setPortalEl] = useState<HTMLDivElement | null>(null);
    const setRootRef = (node: HTMLDivElement | null) => {
        setPortalEl(node);

        if (typeof ref === 'function') {
            ref(node);
            return;
        }

        if (ref) {
            ref.current = node;
        }
    };

    const contextValue = useMemo<IAuiContextValue>(
        () => ({
            ...value,
            direction,
        }),
        [value, direction]
    );

    return (
        <AuiContext.Provider value={contextValue}>
            <PortalProvider getContainer={() => portalEl}>
                <div
                    {...props}
                    ref={setRootRef}
                    className={cn(styles.root, typographyStyles.bodyM, className)}
                    dir={direction}
                >
                    {children}
                </div>
            </PortalProvider>
        </AuiContext.Provider>
    );
};

export const AdminUiProvider = ({
    children,
    direction,
    locale = 'ru-RU',
    labels: labelsProp,
    linkComponent,
    className,
    ...props
}: IAdminUiProviderProps) => {
    const value = useMemo(
        () => ({
            locale,
            labels: { ...defaultLabels, ...labelsProp },
            linkComponent,
        }),
        [locale, labelsProp, linkComponent]
    );

    return (
        <I18nProvider locale={locale}>
            <AdminUiRoot {...props} className={className} direction={direction} value={value}>
                {children}
            </AdminUiRoot>
        </I18nProvider>
    );
};
