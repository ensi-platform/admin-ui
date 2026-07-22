import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const Button = ({ children, className, type = 'button', ...rest }: IButtonProps) => {
    const classNames = [styles.root, className].filter(Boolean).join(' ');

    return (
        <button type={type} className={classNames} {...rest}>
            {children}
        </button>
    );
};
