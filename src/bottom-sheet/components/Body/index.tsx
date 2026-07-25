import cn from 'classnames';

import { useBottomSheetContext } from '../../context';

import { type IBottomSheetBodyProps } from './types';

import styles from './styles.module.css';

export const BottomSheetBody = ({ children, className, ...props }: IBottomSheetBodyProps) => {
    const { contentRef } = useBottomSheetContext();

    return (
        <div {...props} ref={contentRef} className={cn(styles.root, className)}>
            {children}
        </div>
    );
};

BottomSheetBody.displayName = 'BottomSheet.Body';
