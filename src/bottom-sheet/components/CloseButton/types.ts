import { type ButtonHTMLAttributes } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** BottomSheet close control size. */
export type TBottomSheetCloseButtonSize = 'sm' | 'md' | 'lg';

/** Own props for BottomSheet close control. */
export interface IBottomSheetCloseButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>, IDataTestIdProps {
    /** Close control size. */
    size?: TBottomSheetCloseButtonSize;
}
