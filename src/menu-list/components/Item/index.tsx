import { type ElementType, type MouseEvent } from 'react';

import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { ChevronRight } from '@/icons';
import { Tooltip } from '@/tooltip';

import { useMenuList } from '../../context';
import { type TMenuListItemProps } from '../../types';

import { menuListItemVariants } from './theme';

import styles from './styles.module.css';

const itemTypography = {
    sm: typographyStyles.bodyXs,
    md: typographyStyles.bodySTight,
    lg: typographyStyles.bodyM,
} as const;

export const MenuListItem = <P extends ElementType = 'a'>({
    as,
    id,
    children,
    icon: Icon,
    hasChildren = false,
    open = false,
    trailing,
    disabled = false,
    className,
    dataTestId,
    ref,
    onClick,
    href,
    ...props
}: TMenuListItemProps<P>) => {
    const { size, activeId, setActiveId, disabled: listDisabled, collapsed } = useMenuList();
    const isDisabled = disabled || listDisabled;
    const isActive = activeId === id;
    const showTrailing = Boolean(trailing) && !collapsed;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        if (isDisabled) {
            event.preventDefault();
            return;
        }

        onClick?.(event as never);

        if (event.defaultPrevented || hasChildren) {
            return;
        }

        setActiveId(id);
    };

    const Component = (as ?? (href != null ? 'a' : 'button')) as ElementType;
    const leafProps =
        Component === 'button'
            ? { type: 'button' as const, disabled: isDisabled }
            : {
                  href,
                  'aria-disabled': isDisabled || undefined,
                  tabIndex: isDisabled ? -1 : undefined,
              };

    const labelText = typeof children === 'string' ? children : undefined;

    const control = (
        <Component
            {...props}
            {...leafProps}
            ref={ref}
            className={cn(
                menuListItemVariants({ size, active: isActive, open, collapsed }),
                showTrailing && styles.rowControl,
                itemTypography[size],
                className
            )}
            data-test-id={dataTestId}
            data-menu-list-item={showTrailing ? undefined : ''}
            data-active={isActive || undefined}
            data-open={open || undefined}
            onClick={handleClick}
            aria-label={collapsed ? labelText : undefined}
        >
            {Icon ? <Icon className={styles.icon} aria-hidden focusable={false} /> : null}
            {collapsed ? null : <span className={styles.label}>{children}</span>}
            {hasChildren && !collapsed ? (
                <ChevronRight className={styles.chevron} aria-hidden focusable={false} />
            ) : null}
        </Component>
    );

    const withTrailing = showTrailing ? (
        <div
            className={cn(styles.row, isActive && styles.active, open && styles.open, isDisabled && styles.rowDisabled)}
            data-menu-list-item=""
            data-active={isActive || undefined}
            data-open={open || undefined}
        >
            {control}
            <span className={styles.trailing}>{trailing}</span>
        </div>
    ) : (
        control
    );

    if (collapsed && labelText && !hasChildren) {
        return (
            <Tooltip>
                <Tooltip.Trigger>{withTrailing}</Tooltip.Trigger>
                <Tooltip.Content placement="right">{labelText}</Tooltip.Content>
            </Tooltip>
        );
    }

    return withTrailing;
};

MenuListItem.displayName = 'MenuList.Item';
