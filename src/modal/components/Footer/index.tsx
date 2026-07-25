import cn from 'classnames';

import { type IModalFooterProps } from './types';

import styles from './styles.module.css';

export const ModalFooter = ({ children, className, ...props }: IModalFooterProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

ModalFooter.displayName = 'Modal.Footer';
