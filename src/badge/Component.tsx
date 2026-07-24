import cn from 'classnames';

import { badgeVariants } from './theme';
import { type IBadgeProps } from './types';

export const Badge = ({
    ref,
    children,
    size = 'md',
    variant = 'neutral',
    className,
    dataTestId,
    ...props
}: IBadgeProps) => (
    <span {...props} ref={ref} className={cn(badgeVariants({ size, variant }), className)} data-test-id={dataTestId}>
        {children}
    </span>
);

Badge.displayName = 'Badge';
