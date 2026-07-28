import cn from 'classnames';

import { useAuiLabels } from '@/provider';

import { loaderVariants } from './theme';
import { type ILoaderProps } from './types';

import styles from './styles.module.css';

export const Loader = ({
    ref,
    children,
    size = 'md',
    active = false,
    className,
    dataTestId,
    ...props
}: ILoaderProps) => {
    const { loading } = useAuiLabels();

    return (
        <div
            {...props}
            ref={ref}
            className={cn(loaderVariants({ size }), className)}
            data-size={size}
            data-active={active || undefined}
            data-test-id={dataTestId}
            aria-busy={active || undefined}
        >
            {children}
            {active ? (
                <div className={styles.overlay} role="status" aria-live="polite" aria-label={loading}>
                    <span className={styles.spinner} aria-hidden />
                </div>
            ) : null}
        </div>
    );
};

Loader.displayName = 'Loader';
