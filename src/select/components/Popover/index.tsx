import { type ReactNode, type RefObject } from 'react';

import { Popover as RacPopover } from 'react-aria-components';

import { type TSelectVariant } from '../../types';

import { selectPopoverVariants } from './theme';

export interface ISelectPopoverProps {
    triggerRef: RefObject<HTMLElement | null>;
    variant: TSelectVariant;
    children: ReactNode;
}

export const SelectPopover = ({ triggerRef, variant, children }: ISelectPopoverProps) => (
    <RacPopover triggerRef={triggerRef} className={selectPopoverVariants({ variant })} offset={4}>
        {children}
    </RacPopover>
);

SelectPopover.displayName = 'SelectPopover';
