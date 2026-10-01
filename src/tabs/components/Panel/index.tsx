import cn from 'classnames';
import { TabPanel as RacTabPanel } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { type ITabsPanelProps } from '../../types';

import styles from './styles.module.css';

export const TabsPanel = supportRef(({ ref, id, children, className, dataTestId, ...props }: ITabsPanelProps) => (
    <RacTabPanel {...props} ref={ref} id={id} className={cn(styles.root, className)} data-test-id={dataTestId}>
        {children}
    </RacTabPanel>
));

TabsPanel.displayName = 'Tabs.Panel';
