import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { useContextMenu } from '../../context';
import { type IContextMenuItemProps } from '../../types';

import { contextMenuItemVariants } from './theme';

import styles from './styles.module.css';

const itemTypography = {
    sm: typographyStyles.bodyXs,
    md: typographyStyles.bodySTight,
    lg: typographyStyles.bodyM,
} as const;

export const ContextMenuItem = ({
    ref,
    children,
    icon: Icon,
    disabled = false,
    className,
    dataTestId,
    onClick,
    ...props
}: IContextMenuItemProps) => {
    const { size } = useContextMenu();

    return (
        <button
            {...props}
            ref={ref}
            type="button"
            role="menuitem"
            disabled={disabled}
            className={cn(contextMenuItemVariants({ size }), itemTypography[size], className)}
            data-test-id={dataTestId}
            onClick={onClick}
        >
            {Icon ? <Icon className={styles.icon} aria-hidden focusable={false} /> : null}
            {children}
        </button>
    );
};

ContextMenuItem.displayName = 'ContextMenu.Item';
