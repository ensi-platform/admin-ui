import cn from 'classnames';
import { TabPanels as RacTabPanels } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { type IVerticalTabsPanelsProps } from '../../types';

import styles from './styles.module.css';

export const VerticalTabsPanels = supportRef(
    ({ ref, children, className, dataTestId, ...props }: IVerticalTabsPanelsProps) => (
        <RacTabPanels
            {...props}
            ref={ref}
            className={cn(styles.root, className)}
            data-slot="panels"
            data-test-id={dataTestId}
        >
            {children}
        </RacTabPanels>
    )
);

VerticalTabsPanels.displayName = 'VerticalTabs.Panels';
