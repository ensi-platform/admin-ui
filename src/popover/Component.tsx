import { type ComponentProps } from 'react';

import cn from 'classnames';
import {
    Dialog as RacDialog,
    DialogTrigger as RacDialogTrigger,
    OverlayArrow,
    Popover as RacPopover,
    Pressable,
} from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import { popoverVariants } from './theme';
import { type IPopoverContentProps, type IPopoverTriggerProps, type TPopoverProps } from './types';

import styles from './styles.module.css';

type TPressableChild = NonNullable<ComponentProps<typeof Pressable>['children']>;

const PopoverRoot = (props: TPopoverProps) => <RacDialogTrigger {...props} />;

PopoverRoot.displayName = 'Popover';

/** Wraps a custom trigger (e.g. our Button) for RAC DialogTrigger. */
const PopoverTrigger = ({ children }: IPopoverTriggerProps) => <Pressable>{children as TPressableChild}</Pressable>;

PopoverTrigger.displayName = 'Popover.Trigger';

const PopoverContent = ({
    ref,
    children,
    size = 'md',
    variant = 'primary',
    arrow = false,
    offset = 4,
    placement = 'bottom',
    className,
    dataTestId,
    ...props
}: IPopoverContentProps) => (
    <RacPopover
        {...props}
        ref={ref}
        offset={offset}
        placement={placement}
        className={cn(popoverVariants({ size, variant }), className)}
        data-test-id={dataTestId}
    >
        {arrow ? (
            <OverlayArrow className={styles.arrow}>
                <svg className={styles.arrowSvg} viewBox="0 0 12 12" aria-hidden>
                    <path d="M0 0 L6 6 L12 0" />
                </svg>
            </OverlayArrow>
        ) : null}
        <RacDialog className={cn(styles.dialog, typographyStyles.bodyS)}>{children}</RacDialog>
    </RacPopover>
);

PopoverContent.displayName = 'Popover.Content';

export const Popover = Object.assign(PopoverRoot, {
    Trigger: PopoverTrigger,
    Content: PopoverContent,
});
