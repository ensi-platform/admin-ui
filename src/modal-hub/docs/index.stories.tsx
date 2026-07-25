import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { Modal } from '@/modal';

import { type IModalHubItemProps, useModal, useModalAsync } from '../index';

import Description from './Description.md';

const DemoModal = ({
    open,
    onOpenChange,
    onExitComplete,
    title = 'Hub Modal',
}: IModalHubItemProps & { title?: string }) => (
    <Modal open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete}>
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>Открыто через useModal / ModalHub.</Modal.Body>
        <Modal.Footer>
            <Button onClick={() => onOpenChange?.(false)}>Закрыть</Button>
        </Modal.Footer>
    </Modal>
);

const UseModalDemo = () => {
    const { onOpenHandler } = useModal({
        Component: DemoModal,
        props: { title: 'useModal' },
    });

    return <Button onClick={onOpenHandler}>Открыть useModal</Button>;
};

const UseModalAsyncDemo = () => {
    const { onOpenHandler } = useModalAsync({
        loadComponent: () => Promise.resolve({ default: DemoModal }),
        props: { title: 'useModalAsync' },
    });

    return <Button onClick={() => onOpenHandler()}>Открыть useModalAsync</Button>;
};

export default {
    title: 'ModalHub',
    parameters: {
        docs: {
            description: {
                component: Description,
            },
        },
    },
} satisfies Meta;

export const UseModal: StoryObj = {
    render: () => <UseModalDemo />,
};

export const UseModalAsync: StoryObj = {
    render: () => <UseModalAsyncDemo />,
};
