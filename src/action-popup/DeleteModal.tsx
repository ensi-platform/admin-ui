import { useAuiLabels } from '@/provider';

import { ActionPopup } from './Component';
import { type TDeleteModalProps } from './types';

export const DeleteModal = (props: TDeleteModalProps) => {
    const { delete: deleteLabel, notDelete } = useAuiLabels();

    return <ActionPopup {...props} tone="danger" confirmLabel={deleteLabel} cancelLabel={notDelete} />;
};

DeleteModal.displayName = 'DeleteModal';
