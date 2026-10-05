import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type IGridItemProps, type IGridStyle } from '../../types';
import { toGridColumn } from '../../utils';

import styles from './styles.module.css';

export const GridItem = supportRef(({ ref, children, col, className, dataTestId, style, ...props }: IGridItemProps) => {
    const itemStyle: IGridStyle = {
        ...style,
        '--aui-grid-col': toGridColumn(col),
    };

    return (
        <div {...props} ref={ref} className={cn(styles.root, className)} style={itemStyle} data-test-id={dataTestId}>
            {children}
        </div>
    );
});

GridItem.displayName = 'Grid.Item';
