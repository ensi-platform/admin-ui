import { createContext, useContext } from 'react';

import { type IMenuListContextValue } from './types';

export const MenuListContext = createContext<IMenuListContextValue | undefined>(undefined);

export const useMenuList = (): IMenuListContextValue => {
    const context = useContext(MenuListContext);

    if (!context) {
        throw new Error('This component must be used within a <MenuList> component');
    }

    return context;
};
