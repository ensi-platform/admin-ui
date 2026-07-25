import cn from 'classnames';

import { type IBottomSheetHeaderProps } from './types';

import styles from './styles.module.css';

export const BottomSheetHeader = ({ children, className, ...props }: IBottomSheetHeaderProps) => (
    <div {...props} className={cn(styles.root, className)}>
        {children}
    </div>
);

BottomSheetHeader.displayName = 'BottomSheet.Header';
