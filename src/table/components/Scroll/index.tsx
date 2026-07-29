import cn from 'classnames';

import { tableScrollClassName } from '../../theme';
import { type ITableScrollProps } from './types';

export const TableScroll = ({ ref, children, className, dataTestId, ...props }: ITableScrollProps) => (
    <div
        {...props}
        ref={ref}
        className={cn(tableScrollClassName, className)}
        data-test-id={dataTestId}
    >
        {children}
    </div>
);

TableScroll.displayName = 'Table.Scroll';
