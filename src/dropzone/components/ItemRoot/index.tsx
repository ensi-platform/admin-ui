import { type ReactNode } from 'react';

import { GridListItem } from 'react-aria-components';

import { type IDropzoneItem } from '../../types';

/** File root. `div` while uploading, a list row once the file is settled. */
export const ItemRoot = ({
    element,
    elementProps,
    className,
    children,
}: Pick<IDropzoneItem, 'element' | 'elementProps'> & { className: string; children: ReactNode }) => {
    if (element === 'div') {
        return (
            <div {...elementProps} className={className}>
                {children}
            </div>
        );
    }

    return (
        <GridListItem {...elementProps} className={className}>
            {children}
        </GridListItem>
    );
};
