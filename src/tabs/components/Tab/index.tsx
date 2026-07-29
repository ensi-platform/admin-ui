import cn from 'classnames';
import { Tab as RacTab } from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import { useTabs } from '../../context';
import { type ITabsTabProps } from '../../types';
import { TabsIndicator } from '../Indicator';

import { tabsTabVariants } from './theme';

const tabTypography = {
    sm: typographyStyles.bodyXs,
    md: typographyStyles.bodyS,
    lg: typographyStyles.bodyM,
} as const;

export const TabsTab = ({ ref, id, children, disabled = false, className, dataTestId, ...props }: ITabsTabProps) => {
    const { size, variant } = useTabs();

    return (
        <RacTab
            {...props}
            ref={ref}
            id={id}
            isDisabled={disabled}
            className={cn(tabsTabVariants({ size, variant }), tabTypography[size], className)}
            data-size={size}
            data-test-id={dataTestId}
        >
            {children}
            <TabsIndicator />
        </RacTab>
    );
};

TabsTab.displayName = 'Tabs.Tab';
