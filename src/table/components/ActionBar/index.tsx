import cn from 'classnames';

import { Button } from '@/button';
import { MoreVertical } from '@/icons';
import { Popover } from '@/popover';

import { useTableContext } from '../../context';

import { type ITableActionBarProps, type ITableActionItem } from './types';

import styles from './styles.module.css';

const ActionButton = ({
    item,
    size,
    className,
}: {
    item: ITableActionItem;
    size: 'sm' | 'md' | 'lg';
    className?: string;
}) => (
    <Button
        type="button"
        size={size === 'lg' ? 'md' : 'sm'}
        variant={item.danger ? 'danger' : 'secondary'}
        disabled={item.disabled}
        icon={item.icon}
        className={className}
        onClick={event => {
            event.stopPropagation();
            item.onClick?.();
        }}
    >
        {item.text}
    </Button>
);

export const TableActionBar = ({
    items,
    visibleCount = 1,
    overflowLabel = 'More actions',
    dataTestId,
    className,
}: ITableActionBarProps) => {
    const { size } = useTableContext();
    const visible = items.slice(0, Math.max(0, visibleCount));
    const overflow = items.slice(Math.max(0, visibleCount));

    return (
        <div className={cn(styles.root, className)} data-test-id={dataTestId}>
            {visible.map(item => (
                <ActionButton key={item.key ?? String(item.text)} item={item} size={size} />
            ))}
            {overflow.length > 0 ? (
                <Popover>
                    <Popover.Trigger>
                        <Button
                            type="button"
                            size={size === 'lg' ? 'md' : 'sm'}
                            variant="secondary"
                            aria-label={overflowLabel}
                            icon={{ Component: MoreVertical }}
                            className={styles.overflowTrigger}
                            onClick={event => event.stopPropagation()}
                        >
                            <span className={styles.visuallyHidden}>{overflowLabel}</span>
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content placement="bottom end">
                        <div className={styles.menu} role="menu">
                            {overflow.map(item => (
                                <ActionButton
                                    key={item.key ?? String(item.text)}
                                    item={item}
                                    size={size}
                                    className={styles.menuItem}
                                />
                            ))}
                        </div>
                    </Popover.Content>
                </Popover>
            ) : null}
        </div>
    );
};

TableActionBar.displayName = 'Table.ActionBar';
