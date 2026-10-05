import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type IGridLayoutItemProps, type IGridLayoutStyle } from '../../types';
import { toGridLayoutColumn } from '../../utils';

import styles from './styles.module.css';

export const GridLayoutItem = supportRef(
    ({ ref, children, col, className, dataTestId, style, ...props }: IGridLayoutItemProps) => {
        const itemStyle: IGridLayoutStyle = {
            ...style,
            '--aui-grid-layout-col': toGridLayoutColumn(col),
        };

        return (
            <div
                {...props}
                ref={ref}
                className={cn(styles.root, className)}
                style={itemStyle}
                data-test-id={dataTestId}
            >
                {children}
            </div>
        );
    }
);

GridLayoutItem.displayName = 'GridLayout.Item';
