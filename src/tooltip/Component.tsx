import { type ComponentProps } from 'react';

import cn from 'classnames';
import {
    Focusable,
    OverlayArrow,
    Tooltip as RacTooltip,
    TooltipTrigger as RacTooltipTrigger,
} from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import { tooltipVariants } from './theme';
import { type ITooltipContentProps, type ITooltipTriggerProps, type TTooltipProps } from './types';

import styles from './styles.module.css';

type TFocusableChild = NonNullable<ComponentProps<typeof Focusable>['children']>;

const TooltipRoot = ({ delay = 200, closeDelay = 100, ...props }: TTooltipProps) => (
    <RacTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

TooltipRoot.displayName = 'Tooltip';

/** Wraps a custom trigger (e.g. our Button) for RAC TooltipTrigger. */
const TooltipTrigger = ({ children }: ITooltipTriggerProps) => <Focusable>{children as TFocusableChild}</Focusable>;

TooltipTrigger.displayName = 'Tooltip.Trigger';

const TooltipContent = ({
    ref,
    children,
    size = 'md',
    variant = 'primary',
    arrow = false,
    offset = 4,
    className,
    dataTestId,
    ...props
}: ITooltipContentProps) => (
    <RacTooltip
        {...props}
        ref={ref}
        offset={offset}
        className={cn(tooltipVariants({ size, variant }), typographyStyles.bodyXs, className)}
        data-test-id={dataTestId}
    >
        {arrow ? (
            <OverlayArrow className={styles.arrow}>
                <svg className={styles.arrowSvg} viewBox="0 0 12 12" aria-hidden>
                    <path d="M0 0 L6 6 L12 0" />
                </svg>
            </OverlayArrow>
        ) : null}
        {children}
    </RacTooltip>
);

TooltipContent.displayName = 'Tooltip.Content';

export const Tooltip = Object.assign(TooltipRoot, {
    Trigger: TooltipTrigger,
    Content: TooltipContent,
});
