import { useContext } from 'react';

import cn from 'classnames';
import { UNSTABLE_ToastRegion as RacToastRegion } from 'react-aria-components';

import { ToastItem } from './components/ToastItem';
import { ToastContext } from './context';
import { type IToastRegionProps } from './types';

import styles from './styles.module.css';

export const ToastRegion = ({ className, dataTestId, style }: IToastRegionProps) => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('ToastProvider is required. Wrap the app with <ToastProvider>.');
    }

    return (
        <RacToastRegion
            queue={context.queue}
            className={cn(styles.region, className)}
            style={style}
            data-test-id={dataTestId}
        >
            {({ toast }) => <ToastItem toast={toast} />}
        </RacToastRegion>
    );
};

ToastRegion.displayName = 'ToastRegion';
