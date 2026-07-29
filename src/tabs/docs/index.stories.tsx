import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Tabs } from '../Component';
import { type ITabsProps } from '../types';

import Description from './Description.md';

type TTabsStoryProps = Omit<ITabsProps, 'children' | 'value' | 'onChange'>;

const DEFAULT_ARGS: TTabsStoryProps = {
    size: 'md',
    variant: 'primary',
    disabled: false,
    defaultValue: 'general',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TTabsStoryProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
};

const TabsDemo = (props: TTabsStoryProps) => (
    <Tabs {...props}>
        <Tabs.List>
            <Tabs.Tab id="general">Общее</Tabs.Tab>
            <Tabs.Tab id="items">Товары</Tabs.Tab>
            <Tabs.Tab id="history" disabled>
                История
            </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="general">Контент раздела «Общее».</Tabs.Panel>
        <Tabs.Panel id="items">Контент раздела «Товары».</Tabs.Panel>
        <Tabs.Panel id="history">Контент раздела «История».</Tabs.Panel>
    </Tabs>
);

TabsDemo.displayName = 'Tabs';

export default {
    title: 'Tabs',
    component: TabsDemo,
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
} satisfies Meta<typeof TabsDemo>;

export const Default: StoryObj<typeof TabsDemo> = {};

export const Sizes: StoryObj<typeof TabsDemo> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <TabsDemo size="sm" defaultValue="general" />
            <TabsDemo size="md" defaultValue="general" />
            <TabsDemo size="lg" defaultValue="general" />
        </div>
    ),
};

export const Disabled: StoryObj<typeof TabsDemo> = {
    args: {
        disabled: true,
    },
};

const ControlledTabs = () => {
    const [value, setValue] = useState('general');

    return (
        <Tabs value={value} onChange={setValue} size="md">
            <Tabs.List>
                <Tabs.Tab id="general">Общее</Tabs.Tab>
                <Tabs.Tab id="items">Товары</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel id="general">Выбрано: {value}</Tabs.Panel>
            <Tabs.Panel id="items">Выбрано: {value}</Tabs.Panel>
        </Tabs>
    );
};

export const Controlled: StoryObj<typeof TabsDemo> = {
    render: () => <ControlledTabs />,
};
