import { type ButtonHTMLAttributes } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Modal close control size. */
export type TModalCloseButtonSize = 'sm' | 'md' | 'lg';

/** Own props for Modal close control. */
export interface IModalCloseButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>, IDataTestIdProps {
    /** Close control size. */
    size?: TModalCloseButtonSize;
}
