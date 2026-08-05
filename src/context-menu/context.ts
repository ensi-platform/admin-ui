import { createContext, useContext } from 'react';

import { type TContextMenuSize } from './types';

export interface IContextMenuContextValue {
    size: TContextMenuSize;
}

export const ContextMenuContext = createContext<IContextMenuContextValue>({
    size: 'md',
});

export const useContextMenu = () => useContext(ContextMenuContext);
