import { useMemo, type ReactNode } from 'react';

import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { ChevronRight } from '@/icons';
import { useAuiLabels } from '@/provider';

import { getPageItems, type TTablePageItem } from '../../utils';

import { type ITablePaginationProps } from './types';

import styles from './styles.module.css';

const renderPageItem = (
    item: TTablePageItem,
    page: number,
    disabled: boolean,
    onPageChange: (next: number) => void,
    ellipsisKey: string
): ReactNode => {
    if (item === 'ellipsis') {
        return (
            <li key={ellipsisKey} className={styles.ellipsis} aria-hidden>
                …
            </li>
        );
    }

    if (item === page) {
        return (
            <li key={item}>
                <span className={styles.item} aria-current="page">
                    {item}
                </span>
            </li>
        );
    }

    return (
        <li key={item}>
            <button
                type="button"
                className={styles.item}
                aria-label={`Page ${item}`}
                disabled={disabled}
                onClick={() => onPageChange(item)}
            >
                {item}
            </button>
        </li>
    );
};

export const TablePagination = ({
    ref,
    page,
    pageCount,
    onPageChange,
    nextLabel,
    disabled = false,
    className,
    dataTestId,
    'aria-label': ariaLabel = 'Pagination',
    ...props
}: ITablePaginationProps) => {
    const { paginationNext } = useAuiLabels();
    const resolvedNextLabel = nextLabel ?? paginationNext;
    const items = useMemo(() => getPageItems(page, pageCount), [page, pageCount]);
    const isNextDisabled = disabled || page >= pageCount;

    if (pageCount < 2) return null;

    return (
        <nav
            {...props}
            ref={ref}
            className={cn(styles.root, typographyStyles.bodyS, className)}
            aria-label={ariaLabel}
            data-test-id={dataTestId}
        >
            <ul className={styles.list}>
                {items.map((item, index) => renderPageItem(item, page, disabled, onPageChange, `ellipsis-${index}`))}
                <li>
                    <button
                        type="button"
                        className={styles.next}
                        disabled={isNextDisabled}
                        onClick={() => onPageChange(page + 1)}
                    >
                        <span className={styles.nextLabel}>{resolvedNextLabel}</span>
                        <ChevronRight className={styles.chevron} />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

TablePagination.displayName = 'Table.Pagination';
