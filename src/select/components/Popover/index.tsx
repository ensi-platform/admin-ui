import { type ReactNode } from 'react';

import { Popover as RacPopover } from 'react-aria-components';

import { type TSelectVariant } from '../../types';

import { selectPopoverVariants } from './theme';

export interface ISelectPopoverProps {
    variant: TSelectVariant;
    children: ReactNode;
}

export const SelectPopover = ({ variant, children }: ISelectPopoverProps) => (
    <RacPopover className={selectPopoverVariants({ variant })} offset={4}>
        {children}
    </RacPopover>
);

SelectPopover.displayName = 'SelectPopover';
