import { type CSSProperties, type ElementType, type MouseEvent, type ReactNode } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';
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

export const Button = supportRef(
    <P extends ElementType = 'button'>({
        as,
        type = 'button',
        size = 'md',
        variant = 'primary',
        block = false,
        hidden = false,
        loading = false,
        children,
        icon,
        className,
        dataTestId,
        style,
        ...props
    }: TButtonProps<P>) => {
        const Component = as ?? 'button';
        const isButton = Component === 'button';
        const busy = Boolean(loading);
        const { disabled, onClick, ...rest } = props as typeof props & {
            disabled?: boolean;
            onClick?: (event: MouseEvent<HTMLElement>) => void;
        };
        const stateProps = isButton
            ? { ...(Boolean(disabled) || busy ? { disabled: true } : {}) }
            : {
                  ...(disabled !== undefined ? { disabled } : {}),
                  ...(busy ? { 'aria-disabled': true, tabIndex: -1, href: undefined } : {}),
              };

        const rootStyle = {
            ...style,
            ...(icon?.indent !== undefined && { '--button-icon-indent': toCssSize(icon.indent) }),
        } as CSSProperties;

        const label: ReactNode = (
            <>
                {icon && !icon.after ? <ButtonIcon {...icon} /> : null}
                {hidden ? <span hidden>{children}</span> : children}
                {icon && icon.after ? <ButtonIcon {...icon} /> : null}
            </>
        );

        return (
            <Component
                {...(isButton ? { type } : {})}
                className={cn(buttonVariants({ size, variant, block, iconOnly: hidden }), className)}
                data-test-id={dataTestId}
                style={rootStyle}
                {...rest}
                {...stateProps}
                data-loading={busy || undefined}
                aria-busy={busy || undefined}
                onClick={
                    busy
                        ? (event: MouseEvent<HTMLElement>) => {
                              event.preventDefault();
                          }
                        : onClick
                }
            >
                {busy ? <span className={styles.labelHidden}>{label}</span> : label}
                {busy ? <span className={styles.spinner} aria-hidden /> : null}
            </Component>
        );
    }
);
