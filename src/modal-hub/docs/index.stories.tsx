import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { Modal } from '@/modal';

import { type IModalHubItemProps, useModal, useModalAsync } from '../index';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

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
        <Modal.Body>Opened via useModal / ModalHub.</Modal.Body>
        <Modal.Footer>
            <Button onClick={() => onOpenChange?.(false)}>Close</Button>
        </Modal.Footer>
    </Modal>
);

const UseModalDemo = () => {
    const { onOpenHandler } = useModal({
        Component: DemoModal,
        props: { title: 'useModal' },
    });

    return <Button onClick={onOpenHandler}>Open useModal</Button>;
};

const UseModalAsyncDemo = () => {
    const { onOpenHandler } = useModalAsync({
        loadComponent: () => Promise.resolve({ default: DemoModal }),
        props: { title: 'useModalAsync' },
    });

    return <Button onClick={() => onOpenHandler()}>Open useModalAsync</Button>;
};

export default {
    title: 'Overlays/ModalHub',
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        docsCssVariables,
    },
} satisfies Meta;

export const UseModal: StoryObj = {
    render: () => <UseModalDemo />,
};

export const UseModalAsync: StoryObj = {
    render: () => <UseModalAsyncDemo />,
};
