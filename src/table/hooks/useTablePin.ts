import { useLayoutEffect, type RefObject } from 'react';

import { type TTableRowPin } from '../components/Row/types';
import { type TTablePin } from '../types';
import {
    getPinOffsets,
    getPinStuckEdges,
    type ITablePinColumn,
    type ITablePinRow,
    type TTableRtlScroll,
} from '../utils';

const isColumnPin = (value: string | undefined): value is TTablePin => value === 'start' || value === 'end';

const isRowPin = (value: string | undefined): value is TTableRowPin => value === 'top' || value === 'bottom';

const isScrollableOverflow = (value: string) => value === 'auto' || value === 'scroll' || value === 'overlay';

let cachedRtlScroll: Exclude<TTableRtlScroll, 'ltr'> | undefined;

/** Browser model of RTL scrollLeft. */
const getRtlScroll = (): Exclude<TTableRtlScroll, 'ltr'> => {
    if (cachedRtlScroll) return cachedRtlScroll;

    const outer = document.createElement('div');
    const inner = document.createElement('div');

    outer.dir = 'rtl';
    outer.style.width = '100px';
    outer.style.height = '1px';
    outer.style.overflow = 'scroll';
    outer.style.position = 'absolute';
    outer.style.top = '-1000px';
    inner.style.width = '200px';
    inner.style.height = '1px';
    outer.append(inner);
    document.body.append(outer);

    if (outer.scrollLeft > 0) {
        cachedRtlScroll = 'positive-descending';
        outer.remove();

        return cachedRtlScroll;
    }

    outer.scrollLeft = 1;
    cachedRtlScroll = outer.scrollLeft === 0 ? 'negative' : 'positive-ascending';
    outer.remove();

    return cachedRtlScroll;
};

const findScrollContainer = (node: HTMLElement | null): HTMLElement | null => {
    if (!node) return null;

    const style = getComputedStyle(node);

    if (isScrollableOverflow(style.overflowX) || isScrollableOverflow(style.overflowY)) return node;

    return findScrollContainer(node.parentElement);
};

/** Write which pin edges are stuck onto the scrollport. */
const syncTablePinStuck = (table: HTMLTableElement) => {
    const scroller = findScrollContainer(table.parentElement);
    if (!scroller) return;

    const rtlScroll = getComputedStyle(scroller).direction === 'rtl' ? getRtlScroll() : 'ltr';
    const edges = getPinStuckEdges({
        scrollLeft: scroller.scrollLeft,
        scrollTop: scroller.scrollTop,
        scrollWidth: scroller.scrollWidth,
        scrollHeight: scroller.scrollHeight,
        clientWidth: scroller.clientWidth,
        clientHeight: scroller.clientHeight,
        rtlScroll,
    });

    if (edges.length === 0) {
        scroller.removeAttribute('data-pin-stuck');

        return;
    }

    scroller.dataset.pinStuck = edges.join(' ');
};

const clearPinLayout = (table: HTMLTableElement) => {
    table.querySelectorAll<HTMLTableCellElement>('th, td').forEach(cell => {
        cell.style.left = '';
        cell.style.right = '';
        cell.style.top = '';
        cell.style.bottom = '';
        cell.removeAttribute('data-pin-seam');
    });
};

/** Measure pinned cells and write offsets onto the table. */
export const applyTablePinLayout = (table: HTMLTableElement) => {
    clearPinLayout(table);

    const headerCells = table.tHead ? [...table.tHead.rows].flatMap(row => [...row.cells]) : [];
    const bodyRows = [...table.tBodies].flatMap(body => [...body.rows]);
    const widthByIndex = new Map<number, number>();
    const pinByIndex = new Map<number, TTablePin>();

    headerCells.forEach(cell => {
        widthByIndex.set(cell.cellIndex, cell.offsetWidth);
        if (isColumnPin(cell.dataset.pin)) pinByIndex.set(cell.cellIndex, cell.dataset.pin);
    });

    bodyRows.forEach(row => {
        [...row.cells].forEach(cell => {
            if (!widthByIndex.has(cell.cellIndex)) widthByIndex.set(cell.cellIndex, cell.offsetWidth);
            if (isColumnPin(cell.dataset.pin) && !pinByIndex.has(cell.cellIndex)) {
                pinByIndex.set(cell.cellIndex, cell.dataset.pin);
            }
        });
    });

    const columns: ITablePinColumn[] = [...pinByIndex.entries()].map(([cellIndex, pin]) => ({
        cellIndex,
        pin,
        width: widthByIndex.get(cellIndex) ?? 0,
    }));
    const rows: ITablePinRow[] = bodyRows.map(row => ({
        pin: isRowPin(row.dataset.pin) ? row.dataset.pin : undefined,
        height: row.offsetHeight,
    }));
    const stickyHeaderHeight = table.tHead?.hasAttribute('data-sticky') ? table.tHead.offsetHeight : 0;
    const offsets = getPinOffsets({ columns, rows, stickyHeaderHeight });
    const columnByIndex = new Map(offsets.columns.map(item => [item.index, item]));
    const rowByIndex = new Map(offsets.rows.map(item => [item.index, item]));

    const paint = (cell: HTMLTableCellElement, rowOffset: (typeof offsets.rows)[number] | undefined) => {
        const column = columnByIndex.get(cell.cellIndex);
        const pinnedColumn = column != null && cell.dataset.pin === column.edge;

        if (pinnedColumn && column.edge === 'start') cell.style.left = `${column.offset}px`;
        if (pinnedColumn && column.edge === 'end') cell.style.right = `${column.offset}px`;
        if (rowOffset?.edge === 'top') cell.style.top = `${rowOffset.offset}px`;
        if (rowOffset?.edge === 'bottom') cell.style.bottom = `${rowOffset.offset}px`;

        const seams: string[] = [];
        if (pinnedColumn && column.seam) seams.push(column.edge);
        if (rowOffset?.seam) seams.push(rowOffset.edge);
        if (seams.length > 0) cell.dataset.pinSeam = seams.join(' ');
    };

    headerCells.forEach(cell => paint(cell, undefined));
    bodyRows.forEach((row, index) => {
        const rowOffset = rowByIndex.get(index);
        [...row.cells].forEach(cell => paint(cell, rowOffset));
    });
};

/** Keep pin offsets in sync with the table layout. */
export const useTablePin = (tableRef: RefObject<HTMLTableElement | null>) => {
    useLayoutEffect(() => {
        const table = tableRef.current;
        if (!table) return;
        applyTablePinLayout(table);
        syncTablePinStuck(table);
    });

    useLayoutEffect(() => {
        const table = tableRef.current;
        if (!table || typeof ResizeObserver === 'undefined') return undefined;

        const scroller = findScrollContainer(table.parentElement);

        const relayout = () => {
            const node = tableRef.current;
            if (!node) return;
            applyTablePinLayout(node);
            syncTablePinStuck(node);
        };

        const onScroll = () => {
            const node = tableRef.current;
            if (node) syncTablePinStuck(node);
        };

        const observer = new ResizeObserver(relayout);
        observer.observe(table);
        if (scroller) {
            observer.observe(scroller);
            scroller.addEventListener('scroll', onScroll, { passive: true });
        }

        return () => {
            observer.disconnect();
            scroller?.removeEventListener('scroll', onScroll);
        };
    }, [tableRef]);
};
