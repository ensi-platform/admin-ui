import { type ReactNode } from 'react';

import { type HeadingProps as RacHeadingProps } from 'react-aria-components';

export interface IBottomSheetTitleProps extends Omit<RacHeadingProps, 'slot' | 'children'> {
    children: ReactNode;
}
