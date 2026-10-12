import { useCallback, useMemo, useRef, useState, type ElementType, type Ref } from 'react';

import cn from 'classnames';
import { UNSAFE_PortalProvider as PortalProvider } from 'react-aria';
import { I18nProvider, useLocale } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';
import { typographyStyles } from '@ds/typography';

import { AuiContext, defaultLabels } from './context';
import { type IAuiContextValue, type TAdminUiProviderProps } from './types';

import styles from './styles.module.css';

type TRootRef = Ref<HTMLElement>;

type TAdminUiRootProps = {
    as?: ElementType;
    value: Omit<IAuiContextValue, 'direction'>;
    ref?: TRootRef;
} & Omit<TAdminUiProviderProps, 'as' | 'locale' | 'labels' | 'linkComponent' | 'ref'>;

const AdminUiRoot = supportRef(
    ({ as, children, className, direction: directionProp, value, ref, ...props }: TAdminUiRootProps) => {
        const Root = (as ?? 'div') as ElementType;
        const { direction: localeDirection } = useLocale();
        const direction = directionProp ?? localeDirection;
        const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
        const externalRef = useRef<TRootRef>(ref);

        externalRef.current = ref;

        const setRootRef = useCallback((node: HTMLElement | null) => {
            setPortalEl(node);

            const { current } = externalRef;

            if (typeof current === 'function') {
                current(node);

                return;
            }

            if (current) current.current = node;
        }, []);

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
                    <Root
                        {...props}
                        ref={setRootRef}
                        className={cn(styles.root, typographyStyles.bodyM, className)}
                        dir={direction}
                    >
                        {children}
                    </Root>
                </PortalProvider>
            </AuiContext.Provider>
        );
    }
);

export const AdminUiProvider = supportRef(
    <P extends ElementType = 'div'>({
        children,
        direction,
        locale = 'ru-RU',
        labels: labelsProp,
        linkComponent,
        className,
        ...props
    }: TAdminUiProviderProps<P>) => {
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
    }
);
