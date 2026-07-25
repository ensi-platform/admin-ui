import { useAuiLabels } from '@/provider';

import { ActionPopup } from './Component';
import { type TConfirmModalProps } from './types';

export const ConfirmModal = (props: TConfirmModalProps) => {
    const { confirm, cancel } = useAuiLabels();

    return <ActionPopup {...props} tone="primary" confirmLabel={confirm} cancelLabel={cancel} />;
};

ConfirmModal.displayName = 'ConfirmModal';
