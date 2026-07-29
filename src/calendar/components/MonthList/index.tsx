import { type ComponentPropsWithoutRef, type ReactNode, type RefObject } from 'react';

import cn from 'classnames';

import styles from '../../styles.module.css';

export interface IMonthListItem {
    monthKey: string;
    index: number;
    top: number;
    height: number;
}

interface IMonthListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
    months: IMonthListItem[];
    viewportRef: RefObject<HTMLDivElement | null>;
    setMonthEl: (monthKey: string, node: HTMLDivElement | null) => void;
    children: (item: IMonthListItem) => ReactNode;
}

/** Absolute-positioned month stack inside the fake-scroll viewport. */
export const MonthList = ({ months, viewportRef, setMonthEl, className, children, ...props }: IMonthListProps) => (
    <div {...props} ref={viewportRef} className={cn(styles.viewport, className)} data-test-id="calendar-viewport">
        {months.map(item => (
            <div
                key={item.monthKey}
                ref={node => setMonthEl(item.monthKey, node)}
                className={styles.month}
                data-month-key={item.monthKey}
                data-month-offset={item.index}
                style={{ top: item.top }}
            >
                {children(item)}
            </div>
        ))}
    </div>
);

MonthList.displayName = 'MonthList';
