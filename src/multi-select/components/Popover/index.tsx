import { type ReactNode, type RefObject } from 'react';

import { Popover as RacPopover } from 'react-aria-components';

import { type TSelectVariant } from '@/select/types';

import { multiSelectPopoverVariants } from './theme';

export interface IMultiSelectPopoverProps {
    triggerRef: RefObject<HTMLElement | null>;
    variant: TSelectVariant;
    children: ReactNode;
}

export const MultiSelectPopover = ({ triggerRef, variant, children }: IMultiSelectPopoverProps) => (
    <RacPopover triggerRef={triggerRef} className={multiSelectPopoverVariants({ variant })} offset={4}>
        {children}
    </RacPopover>
);

MultiSelectPopover.displayName = 'MultiSelectPopover';
