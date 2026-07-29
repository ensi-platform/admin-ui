import { useMemo } from 'react';

import cn from 'classnames';
import { type Key, Tabs as RacTabs } from 'react-aria-components';

import { TabsList } from './components/List';
import { TabsPanel } from './components/Panel';
import { TabsTab } from './components/Tab';
import { TabsContext } from './context';
import { tabsShellVariants } from './theme';
import { type ITabsProps } from './types';

const TabsRoot = ({
    ref,
    children,
    value,
    defaultValue,
    onChange,
    size = 'md',
    variant = 'primary',
    disabled = false,
    className,
    dataTestId,
    ...props
}: ITabsProps) => {
    const contextValue = useMemo(() => ({ size, variant }), [size, variant]);

    return (
        <TabsContext.Provider value={contextValue}>
            <RacTabs
                {...props}
                ref={ref}
                selectedKey={value}
                defaultSelectedKey={defaultValue}
                onSelectionChange={(key: Key | null) => {
                    if (key == null) {
                        return;
                    }

                    onChange?.(String(key));
                }}
                isDisabled={disabled}
                className={cn(tabsShellVariants({ size, variant }), className)}
                data-size={size}
                data-disabled={disabled || undefined}
                data-test-id={dataTestId}
            >
                {children}
            </RacTabs>
        </TabsContext.Provider>
    );
};

TabsRoot.displayName = 'Tabs';

export const Tabs = Object.assign(TabsRoot, {
    List: TabsList,
    Tab: TabsTab,
    Panel: TabsPanel,
});
