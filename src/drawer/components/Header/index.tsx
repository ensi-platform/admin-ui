import cn from 'classnames';

import { type IDrawerHeaderProps } from './types';

import styles from './styles.module.css';

export const DrawerHeader = ({ children, className, ...props }: IDrawerHeaderProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

DrawerHeader.displayName = 'Drawer.Header';
