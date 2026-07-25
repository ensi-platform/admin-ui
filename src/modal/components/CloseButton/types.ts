import { type ButtonHTMLAttributes } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own props for Modal close control. */
export interface IModalCloseButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>, IDataTestIdProps {}
