import { type ReactNode, useState } from 'react';

import { ChevronDown, Funnel, SortAscending, SortDescending } from '@/icons';
import { Popover } from '@/popover';
import { useAuiLabels } from '@/provider';

import { type TTableSortDirection } from '../../types';
import { isNestedOverlayTarget } from '../../utils';

import styles from './styles.module.css';

const closeUnlessNested = (element: Element) => !isNestedOverlayTarget(element);

const SORT_ROWS = [
    { direction: 'asc', Icon: SortAscending },
    { direction: 'desc', Icon: SortDescending },
] as const;

interface IHeaderFilterProps {
    children?: ReactNode;
    sortable: boolean;
    sortDirection?: TTableSortDirection;
    onSort?: (direction: TTableSortDirection | undefined) => void;
    filter: ReactNode;
    filterActive: boolean;
}

export const HeaderFilter = ({
    children,
    sortable,
    sortDirection,
    onSort,
    filter,
    filterActive,
}: IHeaderFilterProps) => {
    const { sortAscending, sortDescending } = useAuiLabels();
    const [open, setOpen] = useState(false);
    const sortLabels = { asc: sortAscending, desc: sortDescending };

    return (
        <Popover isOpen={open} onOpenChange={setOpen}>
            <Popover.Trigger>
                <button type="button" className={styles.trigger} aria-haspopup="dialog" data-open={open || undefined}>
                    <span className={styles.triggerLabel}>{children}</span>
                    {filterActive ? <Funnel className={styles.filterIcon} data-active aria-hidden /> : null}
                    {sortDirection === 'asc' ? (
                        <SortAscending className={styles.sortMark} data-sort-mark="asc" aria-hidden />
                    ) : null}
                    {sortDirection === 'desc' ? (
                        <SortDescending className={styles.sortMark} data-sort-mark="desc" aria-hidden />
                    ) : null}
                    {!filterActive && sortDirection == null ? (
                        <ChevronDown className={styles.chevron} data-trigger-chevron aria-hidden />
                    ) : null}
                </button>
            </Popover.Trigger>
            <Popover.Content
                className={styles.panel}
                placement="bottom start"
                shouldCloseOnInteractOutside={closeUnlessNested}
            >
                <div className={styles.filterSlot}>{filter}</div>
                {sortable ? (
                    <>
                        <div className={styles.divider} />
                        <div className={styles.sortList}>
                            {SORT_ROWS.map(({ direction, Icon }) => (
                                <button
                                    key={direction}
                                    type="button"
                                    className={styles.sortItem}
                                    onClick={() => onSort?.(direction)}
                                >
                                    <span>{sortLabels[direction]}</span>
                                    <Icon className={styles.sortIcon} aria-hidden />
                                </button>
                            ))}
                        </div>
                    </>
                ) : null}
            </Popover.Content>
        </Popover>
    );
};

HeaderFilter.displayName = 'Table.HeaderFilter';
