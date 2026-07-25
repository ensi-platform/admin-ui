import { type ButtonHTMLAttributes } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Drawer close control size. */
export type TDrawerCloseButtonSize = 'sm' | 'md' | 'lg';

/** Own props for Drawer close control. */
export interface IDrawerCloseButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>, IDataTestIdProps {
    /** Close control size. */
    size?: TDrawerCloseButtonSize;
}
