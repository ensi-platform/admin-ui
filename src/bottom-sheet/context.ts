import { createContext, useContext, type RefObject } from 'react';

export interface IBottomSheetContextValue {
    /** Scrollable Body element (for swipe / scroll coordination). */
    contentRef: RefObject<HTMLDivElement | null>;
}

export const BottomSheetContext = createContext<IBottomSheetContextValue | null>(null);

export const useBottomSheetContext = () => {
    const context = useContext(BottomSheetContext);

    if (!context) {
        throw new Error('useBottomSheetContext must be used within BottomSheet');
    }

    return context;
};
