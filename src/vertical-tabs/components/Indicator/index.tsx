import { SelectionIndicator as RacSelectionIndicator } from 'react-aria-components';

import styles from './styles.module.css';

/** Sliding fill for the selected item (RAC SelectionIndicator). */
export const VerticalTabsIndicator = () => <RacSelectionIndicator className={styles.root} />;

VerticalTabsIndicator.displayName = 'VerticalTabs.Indicator';
