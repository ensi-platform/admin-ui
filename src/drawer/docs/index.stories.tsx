import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { Drawer } from '../Component';
import { type TDrawerCloseButtonSize } from '../components/CloseButton/types';
import { type IDrawerProps } from '../types';

import Description from './Description.md';

import { DrawerStoryComponent } from '.';

const DEFAULT_ARGS: Partial<IDrawerProps> = {
    size: 'md',
    variant: 'primary',
    placement: 'right',
    fullscreen: false,
    dismissable: true,
    keyboardDismissable: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IDrawerProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    placement: { control: { type: 'select' } },
    fullscreen: { control: { type: 'boolean' } },
    dismissable: { control: { type: 'boolean' } },
    keyboardDismissable: { control: { type: 'boolean' } },
};

const DrawerDemo = ({
    triggerLabel,
    closeButtonSize,
    ...props
}: Omit<IDrawerProps, 'open' | 'onOpenChange' | 'children'> & {
    triggerLabel?: string;
    closeButtonSize?: TDrawerCloseButtonSize;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{triggerLabel ?? 'Открыть Drawer'}</Button>
            <Drawer {...props} open={open} onOpenChange={setOpen}>
                <Drawer.Header>
                    <Drawer.Title>Заголовок</Drawer.Title>
                    <Drawer.CloseButton size={closeButtonSize} />
                </Drawer.Header>
                <Drawer.Body>Контент боковой панели.</Drawer.Body>
                <Drawer.Footer>
                    <Button onClick={() => setOpen(false)}>Закрыть</Button>
                </Drawer.Footer>
            </Drawer>
        </>
    );
};

export default {
    title: 'Drawer',
    component: DrawerStoryComponent,
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
} satisfies Meta<typeof DrawerStoryComponent>;

export const Default: StoryObj<IDrawerProps> = {
    render: args => <DrawerDemo {...args} />,
};

export const Placement: StoryObj<IDrawerProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <DrawerDemo placement="left" triggerLabel="Открыть Drawer left" />
            <DrawerDemo placement="right" triggerLabel="Открыть Drawer right" />
        </div>
    ),
};

export const Sizes: StoryObj<IDrawerProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <DrawerDemo size="sm" triggerLabel="Открыть Drawer sm" />
            <DrawerDemo size="md" triggerLabel="Открыть Drawer md" />
            <DrawerDemo size="lg" triggerLabel="Открыть Drawer lg" />
        </div>
    ),
};

export const CloseButtonSizes: StoryObj<IDrawerProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <DrawerDemo closeButtonSize="sm" triggerLabel="CloseButton sm" />
            <DrawerDemo closeButtonSize="md" triggerLabel="CloseButton md" />
            <DrawerDemo closeButtonSize="lg" triggerLabel="CloseButton lg" />
        </div>
    ),
};

export const Fullscreen: StoryObj<IDrawerProps> = {
    render: () => <DrawerDemo fullscreen />,
};
