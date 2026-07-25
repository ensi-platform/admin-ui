import { Button } from '@/button';

import { Popover } from '../Component';
import { type IPopoverContentProps, type TPopoverProps } from '../types';

export type TPopoverStoryProps = TPopoverProps &
    Pick<IPopoverContentProps, 'children' | 'size' | 'variant' | 'arrow' | 'placement'>;

/** Story wrapper for react-docgen-typescript. */
export const PopoverStoryComponent = ({
    children = 'Контент поповера',
    size = 'md',
    variant = 'primary',
    arrow = false,
    placement = 'bottom',
    ...props
}: TPopoverStoryProps) => (
    <Popover {...props}>
        <Popover.Trigger>
            <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Content size={size} variant={variant} arrow={arrow} placement={placement}>
            {children}
        </Popover.Content>
    </Popover>
);

PopoverStoryComponent.displayName = 'Popover';
