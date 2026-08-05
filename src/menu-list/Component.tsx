import { useCallback, useMemo, useState } from 'react';

import cn from 'classnames';

import { MenuListGroup } from './components/Group';
import { MenuListItem } from './components/Item';
import { MenuListContext } from './context';
import { menuListShellVariants } from './theme';
import { type IMenuListProps } from './types';

const MenuListRoot = ({
    ref,
    children,
    value,
    defaultValue,
    onChange,
    size = 'md',
    variant = 'primary',
    disabled = false,
    collapsed = false,
    className,
    dataTestId,
    ...props
}: IMenuListProps) => {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const activeId = value !== undefined ? value : uncontrolled;

    const setActiveId = useCallback(
        (id: string) => {
            if (value === undefined) {
                setUncontrolled(id);
            }

            onChange?.(id);
        },
        [onChange, value]
    );

    const contextValue = useMemo(
        () => ({
            size,
            variant,
            activeId,
            setActiveId,
            disabled,
            collapsed,
        }),
        [activeId, collapsed, disabled, setActiveId, size, variant]
    );

    return (
        <MenuListContext.Provider value={contextValue}>
            <nav
                {...props}
                ref={ref}
                className={cn(menuListShellVariants({ size, variant, collapsed }), className)}
                data-size={size}
                data-collapsed={collapsed || undefined}
                data-disabled={disabled || undefined}
                data-test-id={dataTestId}
            >
                {children}
            </nav>
        </MenuListContext.Provider>
    );
};

MenuListRoot.displayName = 'MenuList';

export const MenuList = Object.assign(MenuListRoot, {
    Group: MenuListGroup,
    Item: MenuListItem,
});
