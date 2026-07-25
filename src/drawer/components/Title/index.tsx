import cn from 'classnames';
import { Heading } from 'react-aria-components';

import { drawerTitleVariants } from './theme';
import { type IDrawerTitleProps } from './types';

export const DrawerTitle = ({ children, className, ...props }: IDrawerTitleProps) => (
    <Heading {...props} slot="title" level={2} className={cn(drawerTitleVariants(), className)}>
        {children}
    </Heading>
);

DrawerTitle.displayName = 'Drawer.Title';
