import { useRef, type Ref } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { useTablePin } from '../../hooks/useTablePin';
import { tableElementClassName } from '../../theme';

import { type ITableElementProps } from './types';

const assignRef = <T,>(ref: Ref<T> | undefined, node: T | null) => {
    if (typeof ref === 'function') {
        ref(node);
        return;
    }

    if (ref) ref.current = node;
};

export const TableElement = supportRef(({ ref, children, className, dataTestId, ...props }: ITableElementProps) => {
    const tableRef = useRef<HTMLTableElement>(null);
    useTablePin(tableRef);

    return (
        <table
            {...props}
            ref={node => {
                tableRef.current = node;
                assignRef(ref, node);
            }}
            className={cn(tableElementClassName, className)}
            data-test-id={dataTestId}
        >
            {children}
        </table>
    );
});

TableElement.displayName = 'Table.Table';
