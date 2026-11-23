import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { FlexLayoutItem } from './components/Item';
import {
    type IFlexLayoutProps,
    type IFlexLayoutStyle,
    type TFlexLayoutAlign,
    type TFlexLayoutGap,
    type TFlexLayoutJustify,
} from './types';

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

const axisGapStyle = (
    style: IFlexLayoutStyle | undefined,
    rowGap: TFlexLayoutGap | undefined,
    columnGap: TFlexLayoutGap | undefined
): IFlexLayoutStyle | undefined => {
    if (rowGap == null && columnGap == null) {
        return style;
    }

    return {
        ...style,
        ...(rowGap != null ? { '--aui-flex-layout-row-gap': `var(--aui-flex-layout-gap-${rowGap})` } : {}),
        ...(columnGap != null ? { '--aui-flex-layout-column-gap': `var(--aui-flex-layout-gap-${columnGap})` } : {}),
    };
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
        rowGap,
        columnGap,
        align = 'stretch',
        justify = 'start',
        wrap = false,
        className,
        dataTestId,
        style,
        ...props
    }: IFlexLayoutProps) => (
        <div
            {...props}
            ref={ref}
            className={cn(
                styles.root,
                direction === 'column' && styles.column,
                wrap && styles.wrap,
                gapClass[gap],
                alignClass[align],
                justifyClass[justify],
                className
            )}
            style={axisGapStyle(style, rowGap, columnGap)}
            data-test-id={dataTestId}
        >
            {children}
        </div>
    )
);

FlexLayoutRoot.displayName = 'FlexLayout';

export const FlexLayout = Object.assign(FlexLayoutRoot, { Item: FlexLayoutItem });
