import cn from 'classnames';
import { TabList as RacTabList } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { useVerticalTabs } from '../../context';
import { type IVerticalTabsListProps } from '../../types';

import { verticalTabsListVariants } from './theme';

export const VerticalTabsList = supportRef(
    ({ ref, children, className, dataTestId, ...props }: IVerticalTabsListProps) => {
        const { size, variant } = useVerticalTabs();

        return (
            <RacTabList
                {...props}
                ref={ref}
                className={cn(verticalTabsListVariants({ size, variant }), className)}
                data-size={size}
                data-test-id={dataTestId}
            >
                {children}
            </RacTabList>
        );
    }
);

VerticalTabsList.displayName = 'VerticalTabs.List';
