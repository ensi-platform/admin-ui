import { type ButtonHTMLAttributes } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own props for Drawer close control. */
export interface IDrawerCloseButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>, IDataTestIdProps {}
