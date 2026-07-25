import { useCallback, useRef } from 'react';

import { useModalHubContext } from './ModalProvider';
import { type IModalHubItemProps, type IUseModalAsyncProps, type TModalHubItemProps } from './types';

const isSyntheticEvent = (value: unknown): boolean =>
    typeof value === 'object' && value !== null && 'nativeEvent' in value;

export const useModalAsync = <P extends IModalHubItemProps>({ loadComponent, props }: IUseModalAsyncProps<P>) => {
    const { appendModal, closeModal } = useModalHubContext();
    const modalIdRef = useRef('');
    const openIntentGenerationRef = useRef(0);

    const onCloseHandler = useCallback(() => {
        if (!modalIdRef.current) {
            return;
        }

        const userOnOpenChange = props?.onOpenChange;
        userOnOpenChange?.(false);
        closeModal(modalIdRef.current);
    }, [props, closeModal]);

    const onOpenHandler = useCallback(
        async (propsOverride?: Partial<TModalHubItemProps<P>>) => {
            const modalPropsOverride = isSyntheticEvent(propsOverride) ? undefined : propsOverride;

            openIntentGenerationRef.current += 1;
            const thisOpenIntentGeneration = openIntentGenerationRef.current;

            const previousModalId = modalIdRef.current;

            if (previousModalId) {
                closeModal(previousModalId);
                modalIdRef.current = '';
            }

            try {
                const { default: ModalComponent } = await loadComponent();

                if (thisOpenIntentGeneration !== openIntentGenerationRef.current) {
                    return;
                }

                const { id } = appendModal({
                    Component: ModalComponent,
                    props: {
                        ...props,
                        ...modalPropsOverride,
                    } as TModalHubItemProps<P>,
                });

                modalIdRef.current = id;
            } catch {
                if (thisOpenIntentGeneration === openIntentGenerationRef.current) {
                    modalIdRef.current = '';
                }
            }
        },
        [loadComponent, props, appendModal, closeModal]
    );

    return { onOpenHandler, onCloseHandler };
};
