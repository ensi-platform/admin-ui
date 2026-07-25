import { cva } from 'class-variance-authority';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const drawerTitleVariants = cva([styles.root, typographyStyles.bodyL]);
