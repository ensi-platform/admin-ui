import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { useMenuList } from '../../context';
import { type IMenuListGroupProps } from '../../types';

import styles from './styles.module.css';

export const MenuListGroup = ({ ref, label, children, className, dataTestId, ...props }: IMenuListGroupProps) => {
    const { collapsed } = useMenuList();

    return (
        <div {...props} ref={ref} className={cn(styles.root, className)} data-test-id={dataTestId}>
            {collapsed ? null : <div className={cn(styles.label, typographyStyles.bodyXs)}>{label}</div>}
            {children}
        </div>
    );
};

MenuListGroup.displayName = 'MenuList.Group';
