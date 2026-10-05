import { useMemo } from 'react';

import cn from 'classnames';
import { type Key, Tabs as RacTabs } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { VerticalTabsItem } from './components/Item';
import { VerticalTabsList } from './components/List';
import { VerticalTabsPanel } from './components/Panel';
import { VerticalTabsPanels } from './components/Panels';
import { VerticalTabsContext } from './context';
import { verticalTabsShellVariants } from './theme';
import { type IVerticalTabsProps } from './types';

const VerticalTabsRoot = supportRef(
    ({
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
    }: IVerticalTabsProps) => {
        const contextValue = useMemo(() => ({ size, variant }), [size, variant]);

        return (
            <VerticalTabsContext.Provider value={contextValue}>
                <RacTabs
                    {...props}
                    ref={ref}
                    orientation="vertical"
                    selectedKey={value}
                    defaultSelectedKey={defaultValue}
                    onSelectionChange={(key: Key | null) => {
                        if (key == null) {
                            return;
                        }

                        onChange?.(String(key));
                    }}
                    isDisabled={disabled}
                    className={cn(verticalTabsShellVariants({ size, variant }), className)}
                    data-size={size}
                    data-disabled={disabled || undefined}
                    data-test-id={dataTestId}
                >
                    {children}
                </RacTabs>
            </VerticalTabsContext.Provider>
        );
    }
);

VerticalTabsRoot.displayName = 'VerticalTabs';

export const VerticalTabs = Object.assign(VerticalTabsRoot, {
    List: VerticalTabsList,
    Item: VerticalTabsItem,
    Panels: VerticalTabsPanels,
    Panel: VerticalTabsPanel,
});
