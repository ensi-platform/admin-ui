import cn from 'classnames';

import { avatarVariants } from './theme';
import { type IAvatarProps } from './types';

import styles from './styles.module.css';

const getInitials = (name?: string): string => {
    if (!name?.trim()) {
        return '';
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const Avatar = ({
    ref,
    size = 'md',
    variant = 'primary',
    src,
    name,
    initials,
    children,
    className,
    dataTestId,
    ...props
}: IAvatarProps) => {
    const label = name ?? initials ?? undefined;
    const text = initials ?? getInitials(name);

    return (
        <span
            {...props}
            ref={ref}
            className={cn(avatarVariants({ size, variant }), className)}
            data-test-id={dataTestId}
            role={src || children ? undefined : 'img'}
            aria-label={src || children ? undefined : label}
            aria-hidden={src || children || label ? undefined : true}
        >
            {children || (src ? <img className={styles.image} src={src} alt={name ?? ''} /> : text)}
        </span>
    );
};

Avatar.displayName = 'Avatar';
