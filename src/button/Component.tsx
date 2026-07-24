import { type CSSProperties, type ElementType } from 'react';

import cn from 'classnames';

import { toCssSize } from '@ds/common/utils';

import { Icon } from '@/icon';

import { buttonVariants } from './theme';
import { type TButtonProps } from './types';

export const Button = <P extends ElementType = 'button'>({
    as,
    type = 'button',
    size = 'md',
    variant = 'primary',
    block = false,
    children,
    icon,
    className,
    dataTestId,
    style,
    ...props
}: TButtonProps<P>) => {
    const Component = as ?? 'button';

    const rootStyle = {
        ...style,
        ...(icon?.indent !== undefined && { '--button-icon-indent': toCssSize(icon.indent) }),
    } as CSSProperties;

    return (
        <Component
            {...(Component === 'button' ? { type } : {})}
            className={cn(buttonVariants({ size, variant, block }), className)}
            data-test-id={dataTestId}
            style={rootStyle}
            {...props}
        >
            {icon && !icon.after ? <Icon {...icon} /> : null}
            {children}
            {icon && icon.after ? <Icon {...icon} /> : null}
        </Component>
    );
};
