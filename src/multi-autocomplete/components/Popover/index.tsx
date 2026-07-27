import { type ReactNode, type RefObject } from 'react';

import { Popover as RacPopover } from 'react-aria-components';

import { type TMultiAutocompleteVariant } from '../../types';

import { multiAutocompletePopoverVariants } from './theme';

export interface IMultiAutocompletePopoverProps {
    triggerRef: RefObject<HTMLElement | null>;
    variant: TMultiAutocompleteVariant;
    children: ReactNode;
}

export const MultiAutocompletePopover = ({ triggerRef, variant, children }: IMultiAutocompletePopoverProps) => (
    <RacPopover triggerRef={triggerRef} className={multiAutocompletePopoverVariants({ variant })} offset={4}>
        {children}
    </RacPopover>
);

MultiAutocompletePopover.displayName = 'MultiAutocompletePopover';
