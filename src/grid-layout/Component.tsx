import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { GridLayoutItem } from './components/Item';
import { type IGridLayoutProps, type IGridLayoutStyle, type TGridLayoutGap } from './types';
import { toGridLayoutColumn, toGridLayoutTemplate } from './utils';

import styles from './styles.module.css';

const gapClass: Record<TGridLayoutGap, string> = {
    0: styles.gap0,
    4: styles.gap4,
    8: styles.gap8,
    12: styles.gap12,
    16: styles.gap16,
    20: styles.gap20,
    24: styles.gap24,
    32: styles.gap32,
    40: styles.gap40,
    48: styles.gap48,
    64: styles.gap64,
};

const alignClass = {
    start: styles.start,
    center: styles.center,
    end: styles.end,
    stretch: null,
} as const;

const GridLayoutRoot = supportRef(
    ({
        ref,
        children,
        cols,
        gap = 16,
        col,
        align = 'stretch',
        hidden = false,
        className,
        dataTestId,
        style,
        ...props
    }: IGridLayoutProps) => {
        const gridStyle: IGridLayoutStyle = {
            ...style,
            '--aui-grid-layout-template': toGridLayoutTemplate(cols),
            '--aui-grid-layout-col': toGridLayoutColumn(col),
        };

        return (
            <div
                {...props}
                ref={ref}
                hidden={hidden}
                className={cn(styles.root, gapClass[gap], alignClass[align], className)}
                style={gridStyle}
                data-test-id={dataTestId}
            >
                {children}
            </div>
        );
    }
);

GridLayoutRoot.displayName = 'GridLayout';

export const GridLayout = Object.assign(GridLayoutRoot, { Item: GridLayoutItem });
