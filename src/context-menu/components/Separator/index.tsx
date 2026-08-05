import cn from 'classnames';

import { type IContextMenuSeparatorProps } from '../../types';

import styles from './styles.module.css';

export const ContextMenuSeparator = ({ className, dataTestId, ...props }: IContextMenuSeparatorProps) => (
    <div {...props} role="separator" className={cn(styles.root, className)} data-test-id={dataTestId} />
);

ContextMenuSeparator.displayName = 'ContextMenu.Separator';
