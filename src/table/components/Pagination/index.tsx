import { useMemo, type ReactNode } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';
import { typographyStyles } from '@ds/typography';

import { ChevronLeft, ChevronRight } from '@/icons';
import { useAuiLabels } from '@/provider';

import { getPageItems, type TTablePageItem } from '../../utils';

import { type ITablePaginationProps } from './types';

import styles from './styles.module.css';

const formatRange = (template: string, from: number, to: number, total: number) =>
    template.replaceAll('{from}', String(from)).replaceAll('{to}', String(to)).replaceAll('{total}', String(total));

const formatPageLabel = (template: string, page: number) => template.replaceAll('{page}', String(page));

const renderPageItem = (
    item: TTablePageItem,
    page: number,
    disabled: boolean,
    onPageChange: (next: number) => void,
    pageLabel: string,
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
                aria-label={formatPageLabel(pageLabel, item)}
                disabled={disabled}
                onClick={() => onPageChange(item)}
            >
                {item}
            </button>
        </li>
    );
};

export const TablePagination = supportRef(
    ({
        ref,
        page,
        pageCount,
        onPageChange,
        from,
        to,
        total,
        rangeLabel,
        prevLabel,
        nextLabel,
        disabled = false,
        className,
        dataTestId,
        'aria-label': ariaLabel = 'Pagination',
        ...props
    }: ITablePaginationProps) => {
        const { paginationPrev, paginationNext, paginationPage, paginationRange } = useAuiLabels();
        const resolvedPrevLabel = prevLabel ?? paginationPrev;
        const resolvedNextLabel = nextLabel ?? paginationNext;
        const resolvedRange = rangeLabel ?? formatRange(paginationRange, from, to, total);
        const items = useMemo(() => (pageCount >= 2 ? getPageItems(page, pageCount) : []), [page, pageCount]);
        const isPrevDisabled = disabled || page <= 1 || pageCount < 1;
        const isNextDisabled = disabled || page >= pageCount || pageCount < 1;

        return (
            <nav
                {...props}
                ref={ref}
                className={cn(styles.root, typographyStyles.bodyS, className)}
                aria-label={ariaLabel}
                data-test-id={dataTestId}
            >
                <span className={styles.range}>{resolvedRange}</span>
                <button
                    type="button"
                    className={styles.control}
                    aria-label={resolvedPrevLabel}
                    disabled={isPrevDisabled}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft className={styles.chevron} />
                </button>
                {items.length > 0 ? (
                    <ul className={styles.list}>
                        {items.map((item, index) =>
                            renderPageItem(item, page, disabled, onPageChange, paginationPage, `ellipsis-${index}`)
                        )}
                    </ul>
                ) : null}
                <button
                    type="button"
                    className={styles.control}
                    aria-label={resolvedNextLabel}
                    disabled={isNextDisabled}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRight className={styles.chevron} />
                </button>
            </nav>
        );
    }
);

TablePagination.displayName = 'Table.Pagination';
