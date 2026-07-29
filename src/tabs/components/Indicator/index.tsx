import { SelectionIndicator as RacSelectionIndicator } from 'react-aria-components';

import styles from './styles.module.css';

/** Sliding underline for the selected tab (RAC SelectionIndicator). */
export const TabsIndicator = () => <RacSelectionIndicator className={styles.root} />;

TabsIndicator.displayName = 'Tabs.Indicator';
