import cn from 'classnames';

import { type IDrawerBodyProps } from './types';

import styles from './styles.module.css';

export const DrawerBody = ({ children, className, ...props }: IDrawerBodyProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

DrawerBody.displayName = 'Drawer.Body';
