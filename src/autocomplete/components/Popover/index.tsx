import { type ReactNode, type RefObject } from 'react';

import { Popover as RacPopover } from 'react-aria-components';

import { type TAutocompleteVariant } from '../../types';

import { autocompletePopoverVariants } from './theme';

export interface IAutocompletePopoverProps {
    triggerRef: RefObject<HTMLElement | null>;
    variant: TAutocompleteVariant;
    children: ReactNode;
}

export const AutocompletePopover = ({ triggerRef, variant, children }: IAutocompletePopoverProps) => (
    <RacPopover triggerRef={triggerRef} className={autocompletePopoverVariants({ variant })} offset={4}>
        {children}
    </RacPopover>
);

AutocompletePopover.displayName = 'AutocompletePopover';
