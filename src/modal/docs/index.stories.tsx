import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { Modal } from '../Component';
import { type TModalCloseButtonSize } from '../components/CloseButton/types';
import { type IModalProps } from '../types';

import Description from './Description.md';

import { ModalStoryComponent } from '.';

const DEFAULT_ARGS: Partial<IModalProps> = {
    size: 'md',
    variant: 'primary',
    fullscreen: false,
    dismissable: true,
    keyboardDismissable: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IModalProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    fullscreen: { control: { type: 'boolean' } },
    dismissable: { control: { type: 'boolean' } },
    keyboardDismissable: { control: { type: 'boolean' } },
};

const ModalDemo = ({
    triggerLabel,
    closeButtonSize,
    ...props
}: Omit<IModalProps, 'open' | 'onOpenChange' | 'children'> & {
    triggerLabel?: string;
    closeButtonSize?: TModalCloseButtonSize;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{triggerLabel ?? 'Открыть Modal'}</Button>
            <Modal {...props} open={open} onOpenChange={setOpen}>
                <Modal.Header>
                    <Modal.Title>Заголовок</Modal.Title>
                    <Modal.CloseButton size={closeButtonSize} />
                </Modal.Header>
                <Modal.Body>Контент модального окна.</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <Button onClick={() => setOpen(false)}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default {
    title: 'Modal',
    component: ModalStoryComponent,
    parameters: {
        docs: {
            description: {
                component: Description,
            },
        },
        controls: {
            expanded: true,
        },
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof ModalStoryComponent>;

export const Default: StoryObj<IModalProps> = {
    render: args => <ModalDemo {...args} />,
};

export const Sizes: StoryObj<IModalProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <ModalDemo size="sm" triggerLabel="Открыть Modal sm" />
            <ModalDemo size="md" triggerLabel="Открыть Modal md" />
            <ModalDemo size="lg" triggerLabel="Открыть Modal lg" />
        </div>
    ),
};

export const CloseButtonSizes: StoryObj<IModalProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <ModalDemo closeButtonSize="sm" triggerLabel="CloseButton sm" />
            <ModalDemo closeButtonSize="md" triggerLabel="CloseButton md" />
            <ModalDemo closeButtonSize="lg" triggerLabel="CloseButton lg" />
        </div>
    ),
};

export const Fullscreen: StoryObj<IModalProps> = {
    render: () => <ModalDemo fullscreen />,
};
