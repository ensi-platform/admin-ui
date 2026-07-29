import cn from 'classnames';
import { TabPanel as RacTabPanel } from 'react-aria-components';

import { type ITabsPanelProps } from '../../types';

import styles from './styles.module.css';

export const TabsPanel = ({ ref, id, children, className, dataTestId, ...props }: ITabsPanelProps) => (
    <RacTabPanel {...props} ref={ref} id={id} className={cn(styles.root, className)} data-test-id={dataTestId}>
        {children}
    </RacTabPanel>
);

TabsPanel.displayName = 'Tabs.Panel';
