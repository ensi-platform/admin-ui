import { useCallback, useRef } from 'react';

import { useModalHubContext } from './ModalProvider';
import { type IModalHubItemProps, type IUseModalProps, type TModalHubItemProps } from './types';

export const useModal = <P extends IModalHubItemProps>({ Component, props }: IUseModalProps<P>) => {
    const { appendModal, closeModal } = useModalHubContext();
    const modalIdRef = useRef('');

    const onCloseHandler = useCallback(() => {
        if (!modalIdRef.current) {
            return;
        }

        const userOnOpenChange = props?.onOpenChange;
        userOnOpenChange?.(false);
        closeModal(modalIdRef.current);
    }, [props, closeModal]);

    const onOpenHandler = useCallback(() => {
        const { id } = appendModal({
            Component,
            props: {
                ...props,
            } as TModalHubItemProps<P>,
        });
        modalIdRef.current = id;
    }, [Component, props, appendModal]);

    return { onOpenHandler, onCloseHandler };
};
