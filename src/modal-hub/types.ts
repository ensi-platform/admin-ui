import { type ComponentType, type ReactNode } from 'react';

/** Props required for a component rendered by ModalHub. */
export interface IModalHubItemProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    onExitComplete?: () => void;
}

export type TModalHubComponent<P extends IModalHubItemProps = IModalHubItemProps> = ComponentType<P>;

export type TModalHubItemProps<P extends IModalHubItemProps = IModalHubItemProps> = Omit<P, 'open'> &
    Partial<Pick<P, 'open'>>;

export interface IModalHubEntry<P extends IModalHubItemProps = IModalHubItemProps> {
    id: string;
    Component: TModalHubComponent<P>;
    props: P;
}

export interface IModalHubContextValue {
    modals: IModalHubEntry[];
    appendModal: <P extends IModalHubItemProps>(entry: {
        Component: TModalHubComponent<P>;
        props: TModalHubItemProps<P>;
    }) => { id: string };
    closeModal: (id: string) => void;
    removeModal: (id: string) => void;
    removeAll: () => void;
}

export interface IModalProviderProps {
    children: ReactNode;
}

/** Props for useModal (sync component). */
export interface IUseModalProps<P extends IModalHubItemProps> {
    Component: TModalHubComponent<P>;
    props?: TModalHubItemProps<P>;
}

/** Props for useModalAsync (lazy component). */
export interface IUseModalAsyncProps<P extends IModalHubItemProps> {
    loadComponent: () => Promise<{ default: TModalHubComponent<P> }>;
    props?: TModalHubItemProps<P>;
}
