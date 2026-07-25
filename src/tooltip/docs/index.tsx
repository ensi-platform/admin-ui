import { Button } from '@/button';

import { Tooltip } from '../Component';
import { type ITooltipContentProps, type TTooltipProps } from '../types';

export type TTooltipStoryProps = TTooltipProps &
    Pick<ITooltipContentProps, 'children' | 'size' | 'variant' | 'arrow' | 'placement'>;

/** Story wrapper for react-docgen-typescript. */
export const TooltipStoryComponent = ({
    children = 'Подсказка',
    size = 'md',
    variant = 'primary',
    arrow = false,
    placement,
    delay = 200,
    ...props
}: TTooltipStoryProps) => (
    <Tooltip delay={delay} {...props}>
        <Tooltip.Trigger>
            <Button>Hover me</Button>
        </Tooltip.Trigger>
        <Tooltip.Content size={size} variant={variant} arrow={arrow} placement={placement}>
            {children}
        </Tooltip.Content>
    </Tooltip>
);

TooltipStoryComponent.displayName = 'Tooltip';
