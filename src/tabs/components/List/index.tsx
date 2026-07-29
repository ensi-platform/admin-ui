import cn from 'classnames';
import { TabList as RacTabList } from 'react-aria-components';

import { useTabs } from '../../context';
import { type ITabsListProps } from '../../types';

import { tabsListVariants } from './theme';

export const TabsList = ({ ref, children, className, dataTestId, ...props }: ITabsListProps) => {
    const { size, variant } = useTabs();

    return (
        <RacTabList
            {...props}
            ref={ref}
            className={cn(tabsListVariants({ size, variant }), className)}
            data-size={size}
            data-test-id={dataTestId}
        >
            {children}
        </RacTabList>
    );
};

TabsList.displayName = 'Tabs.List';
