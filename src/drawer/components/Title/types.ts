import { type ReactNode } from 'react';

import { type HeadingProps as RacHeadingProps } from 'react-aria-components';

export interface IDrawerTitleProps extends Omit<RacHeadingProps, 'slot' | 'children'> {
    children: ReactNode;
}
