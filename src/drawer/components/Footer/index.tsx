import cn from 'classnames';

import { type IDrawerFooterProps } from './types';

import styles from './styles.module.css';

export const DrawerFooter = ({ children, className, ...props }: IDrawerFooterProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

DrawerFooter.displayName = 'Drawer.Footer';
