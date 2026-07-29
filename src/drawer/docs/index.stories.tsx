import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { Drawer } from '../Component';
import { type IDrawerProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

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
    ...props
}: Omit<IDrawerProps, 'open' | 'onOpenChange' | 'children'> & {
    triggerLabel?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{triggerLabel ?? 'Open Drawer'}</Button>
            <Drawer {...props} open={open} onOpenChange={setOpen}>
                <Drawer.Header>
                    <Drawer.Title>Title</Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body>Side panel content.</Drawer.Body>
                <Drawer.Footer>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </Drawer.Footer>
            </Drawer>
        </>
    );
};

export default {
    title: 'Overlays/Drawer',
    component: DrawerStoryComponent,
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
} satisfies Meta<typeof DrawerStoryComponent>;

export const Default: StoryObj<IDrawerProps> = {
    render: args => <DrawerDemo {...args} />,
};

export const Placement: StoryObj<IDrawerProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <DrawerDemo placement="left" triggerLabel="Open Drawer left" />
            <DrawerDemo placement="right" triggerLabel="Open Drawer right" />
        </div>
    ),
};

export const Sizes: StoryObj<IDrawerProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <DrawerDemo size="sm" triggerLabel="Open Drawer sm" />
            <DrawerDemo size="md" triggerLabel="Open Drawer md" />
            <DrawerDemo size="lg" triggerLabel="Open Drawer lg" />
        </div>
    ),
};

export const Fullscreen: StoryObj<IDrawerProps> = {
    render: () => <DrawerDemo fullscreen />,
};
