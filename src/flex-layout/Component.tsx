import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { FlexLayoutItem } from './components/Item';
import { type IFlexLayoutProps, type TFlexLayoutAlign, type TFlexLayoutGap, type TFlexLayoutJustify } from './types';

import styles from './styles.module.css';

const gapClass: Record<TFlexLayoutGap, string> = {
    0: styles.gap0,
    4: styles.gap4,
    8: styles.gap8,
    12: styles.gap12,
    16: styles.gap16,
    20: styles.gap20,
    24: styles.gap24,
    32: styles.gap32,
    40: styles.gap40,
    48: styles.gap48,
    64: styles.gap64,
};

const alignClass: Record<TFlexLayoutAlign, string | null> = {
    start: styles.start,
    center: styles.center,
    end: styles.end,
    stretch: null,
};

const justifyClass: Record<TFlexLayoutJustify, string> = {
    start: styles.justifyStart,
    center: styles.justifyCenter,
    end: styles.justifyEnd,
    between: styles.between,
};

const FlexLayoutRoot = supportRef(
    ({
        ref,
        children,
        direction = 'row',
        gap = 16,
        align = 'stretch',
        justify = 'start',
        wrap = false,
        hidden = false,
        className,
        dataTestId,
        ...props
    }: IFlexLayoutProps) => (
        <div
            {...props}
            ref={ref}
            hidden={hidden}
            className={cn(
                styles.root,
                direction === 'column' && styles.column,
                wrap && styles.wrap,
                gapClass[gap],
                alignClass[align],
                justifyClass[justify],
                className
            )}
            data-test-id={dataTestId}
        >
            {children}
        </div>
    )
);

FlexLayoutRoot.displayName = 'FlexLayout';

export const FlexLayout = Object.assign(FlexLayoutRoot, { Item: FlexLayoutItem });
