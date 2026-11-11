import { useModalHubContext } from './ModalProvider';

export const ModalHub = () => {
    const { modals, closeModal, removeModal } = useModalHubContext();

    return (
        <>
            {modals.map(({ id, Component, props }) => {
                const { onOpenChange, onExitComplete, open, ...restProps } = props;

                return (
                    <Component
                        key={id}
                        {...restProps}
                        open={open}
                        onOpenChange={nextOpen => {
                            onOpenChange?.(nextOpen);

                            if (!nextOpen) {
                                closeModal(id);
                            }
                        }}
                        onExitComplete={() => {
                            onExitComplete?.();
                            removeModal(id);
                        }}
                    />
                );
            })}
        </>
    );
};

ModalHub.displayName = 'ModalHub';
