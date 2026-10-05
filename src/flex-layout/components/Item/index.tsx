import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type IFlexLayoutItemProps } from '../../types';

import styles from './styles.module.css';

export const FlexLayoutItem = supportRef(
    ({ ref, children, grow = false, className, dataTestId, ...props }: IFlexLayoutItemProps) => (
        <div {...props} ref={ref} className={cn(styles.root, grow && styles.grow, className)} data-test-id={dataTestId}>
            {children}
        </div>
    )
);

FlexLayoutItem.displayName = 'FlexLayout.Item';
