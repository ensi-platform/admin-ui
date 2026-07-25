import cn from 'classnames';

import { type IBottomSheetFooterProps } from './types';

import styles from './styles.module.css';

export const BottomSheetFooter = ({ children, className, ...props }: IBottomSheetFooterProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

BottomSheetFooter.displayName = 'BottomSheet.Footer';
