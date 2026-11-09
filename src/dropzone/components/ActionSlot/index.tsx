import { Trash } from '@/icons';

import { type IRowAction } from '../../types';
import { DropzoneAction } from '../Action';

export const stopRowPress = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
};

const showsLabel = (action: IRowAction) => action.key === 'retry' || action.key === 'cancel';

/** Row buttons. `className` is the item's own placement, not the control look. */
export const ActionSlot = ({ actions, className }: { actions: readonly IRowAction[]; className?: string }) => (
    <>
        {actions.map(action => {
            const labeled = showsLabel(action);

            return (
                <DropzoneAction
                    key={action.key}
                    className={className}
                    data-dropzone-remove={labeled ? undefined : ''}
                    hidden={!labeled}
                    icon={labeled ? undefined : Trash}
                    disabled={action.disabled}
                    onPointerDown={stopRowPress}
                    onClick={action.run}
                >
                    {action.label}
                </DropzoneAction>
            );
        })}
    </>
);
