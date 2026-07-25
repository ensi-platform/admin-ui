import cn from 'classnames';

import { type IModalHeaderProps } from './types';

import styles from './styles.module.css';

export const ModalHeader = ({ children, className, ...props }: IModalHeaderProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

ModalHeader.displayName = 'Modal.Header';
