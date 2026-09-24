import cn from 'classnames';

import { MoreVertical } from '@/icons';
import { useAuiLabels } from '@/provider';

import { type IDataTableActionsProps } from '../../types';

import styles from './styles.module.css';

export const DataTableActions = ({ onClick, label, dataTestId, className }: IDataTableActionsProps) => {
    const { moreActions } = useAuiLabels();
    const accessibleName = label ?? moreActions;

    return (
        <button
            type="button"
            aria-label={accessibleName}
            className={cn(styles.trigger, className)}
            data-row-actions=""
            data-test-id={dataTestId}
            onClick={event => {
                event.stopPropagation();
                onClick?.(event);
            }}
        >
            <MoreVertical width={16} height={16} />
            <span className={styles.visuallyHidden}>{accessibleName}</span>
        </button>
    );
};

DataTableActions.displayName = 'DataTable.Actions';
