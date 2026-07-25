import { cva } from 'class-variance-authority';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const bottomSheetTitleVariants = cva([styles.root, typographyStyles.bodyL]);
