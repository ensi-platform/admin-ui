import { type CSSProperties, type ElementType } from 'react';

import cn from 'classnames';

import { toCssSize } from '@ds/common/utils';

import { buttonVariants } from './theme';
import { type IButtonIconProps, type TButtonProps } from './types';

import styles from './styles.module.css';

const ButtonIcon = ({ Component, size, fill, className }: IButtonIconProps) => {
    const style = {
        ...(size !== undefined && { '--icon-size': toCssSize(size) }),
        ...(fill !== undefined && { '--icon-fill': fill }),
    } as CSSProperties;

    return <Component className={cn(styles.icon, className)} style={style} aria-hidden focusable={false} />;
};

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
            {icon && !icon.after ? <ButtonIcon {...icon} /> : null}
            {children}
            {icon && icon.after ? <ButtonIcon {...icon} /> : null}
        </Component>
    );
};
