import { type ReactNode, type RefObject } from 'react';

import { Popover as RacPopover } from 'react-aria-components';

import { type TComboboxVariant } from '../../types';

import { comboboxPopoverVariants } from './theme';

export interface IComboboxPopoverProps {
    triggerRef: RefObject<HTMLElement | null>;
    variant: TComboboxVariant;
    children: ReactNode;
}

export const ComboboxPopover = ({ triggerRef, variant, children }: IComboboxPopoverProps) => (
    <RacPopover triggerRef={triggerRef} className={comboboxPopoverVariants({ variant })} offset={4}>
        {children}
    </RacPopover>
);

ComboboxPopover.displayName = 'ComboboxPopover';
