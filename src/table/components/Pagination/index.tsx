import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { ChevronLeft, ChevronRight } from '@/icons';
import { useAuiLabels } from '@/provider';

import { type ITablePaginationProps } from './types';

import styles from './styles.module.css';

const formatRange = (template: string, from: number, to: number, total: number) =>
    template.replaceAll('{from}', String(from)).replaceAll('{to}', String(to)).replaceAll('{total}', String(total));

export const TablePagination = ({
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
    const { paginationPrev, paginationNext, paginationRange } = useAuiLabels();
    const resolvedPrevLabel = prevLabel ?? paginationPrev;
    const resolvedNextLabel = nextLabel ?? paginationNext;
    const resolvedRange = rangeLabel ?? formatRange(paginationRange, from, to, total);
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
};

TablePagination.displayName = 'Table.Pagination';
