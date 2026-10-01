import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { tableElementClassName } from '../../theme';

import { type ITableElementProps } from './types';

export const TableElement = supportRef(({ ref, children, className, dataTestId, ...props }: ITableElementProps) => (
    <table {...props} ref={ref} className={cn(tableElementClassName, className)} data-test-id={dataTestId}>
        {children}
    </table>
));

TableElement.displayName = 'Table.Table';
