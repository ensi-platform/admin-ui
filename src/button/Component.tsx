import { type CSSProperties, type ElementType, type SVGProps } from 'react';

import cn from 'classnames';

import { toCssSize } from '../common/utils.js';

import { buttonVariants } from './theme.js';
import { type TButtonProps } from './types.js';

import styles from './styles.module.css';

export const Button = <P extends ElementType = 'button'>({
    as,
    type = 'button',
    size = 'md',
    variant = 'primary',
    children,
    icon,
    className,
    dataTestId,
    style,
    ...props
}: TButtonProps<P>) => {
    const Component = as ?? 'button';

    const iconStyle = {
        ...(icon?.size !== undefined && { '--button-icon-size': toCssSize(icon.size) }),
        ...(icon?.fill !== undefined && { '--button-icon-fill': icon.fill }),
    } as CSSProperties;

    const rootStyle = {
        ...style,
        ...(icon?.indent !== undefined && { '--button-icon-indent': toCssSize(icon.indent) }),
    } as CSSProperties;

    const iconProps: SVGProps<SVGSVGElement> = {
        className: cn(styles.icon, icon?.className),
        style: iconStyle,
        'aria-hidden': true,
        focusable: false,
    };

    const Icon = icon?.Component;

    return (
        <Component
            {...(Component === 'button' ? { type } : {})}
            className={cn(buttonVariants({ size, variant }), className)}
            data-test-id={dataTestId}
            style={rootStyle}
            {...props}
        >
            {Icon && !icon.after ? <Icon {...iconProps} /> : null}
            {children}
            {Icon && icon.after ? <Icon {...iconProps} /> : null}
        </Component>
    );
};
