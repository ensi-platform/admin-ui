import { useCallback, useContext, useMemo, useState } from 'react';

import { ModalHubContext } from './context';
import { type IModalHubContextValue, type IModalHubEntry, type IModalHubItemProps, type IModalProviderProps } from './types';

export const ModalProvider = ({ children }: IModalProviderProps) => {
    const [modals, setModals] = useState<IModalHubEntry[]>([]);

    const appendModal = useCallback<IModalHubContextValue['appendModal']>(({ Component, props }) => {
        const id = crypto.randomUUID();
        const entry: IModalHubEntry = {
            id,
            Component: Component as IModalHubEntry['Component'],
            props: {
                ...props,
                open: true,
            } as IModalHubItemProps,
        };

        setModals(prev => [...prev, entry]);

        return { id };
    }, []);

    const closeModal = useCallback((id: string) => {
        setModals(prev =>
            prev.map(modal => (modal.id === id ? { ...modal, props: { ...modal.props, open: false } } : modal))
        );
    }, []);

    const removeModal = useCallback((id: string) => {
        setModals(prev => prev.filter(modal => modal.id !== id));
    }, []);

    const removeAll = useCallback(() => {
        setModals([]);
    }, []);

    const value = useMemo<IModalHubContextValue>(
        () => ({
            modals,
            appendModal,
            closeModal,
            removeModal,
            removeAll,
        }),
        [modals, appendModal, closeModal, removeModal, removeAll]
    );

    return <ModalHubContext.Provider value={value}>{children}</ModalHubContext.Provider>;
};

ModalProvider.displayName = 'ModalProvider';

export const useModalHubContext = (): IModalHubContextValue => {
    const context = useContext(ModalHubContext);

    if (!context) {
        throw new Error('ModalProvider is required. Wrap the app with <ModalProvider>.');
    }

    return context;
};
