import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { Modal } from '../Component';
import { type IModalProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

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
    ...props
}: Omit<IModalProps, 'open' | 'onOpenChange' | 'children'> & {
    triggerLabel?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{triggerLabel ?? 'Open Modal'}</Button>
            <Modal {...props} open={open} onOpenChange={setOpen}>
                <Modal.Header>
                    <Modal.Title>Title</Modal.Title>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>Modal content.</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => setOpen(false)}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default {
    title: 'Overlays/Modal',
    component: ModalStoryComponent,
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
            <ModalDemo size="sm" triggerLabel="Open Modal sm" />
            <ModalDemo size="md" triggerLabel="Open Modal md" />
            <ModalDemo size="lg" triggerLabel="Open Modal lg" />
        </div>
    ),
};

export const Fullscreen: StoryObj<IModalProps> = {
    render: () => <ModalDemo fullscreen />,
};
