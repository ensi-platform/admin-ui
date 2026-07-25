import cn from 'classnames';

import { type IModalBodyProps } from './types';

import styles from './styles.module.css';

export const ModalBody = ({ children, className, ...props }: IModalBodyProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

ModalBody.displayName = 'Modal.Body';
