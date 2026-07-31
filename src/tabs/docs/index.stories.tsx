import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Tabs } from '../Component';
import { type ITabsProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

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
            <Tabs.Tab id="general">General</Tabs.Tab>
            <Tabs.Tab id="items">Items</Tabs.Tab>
            <Tabs.Tab id="history" disabled>
                History
            </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="general">General section content.</Tabs.Panel>
        <Tabs.Panel id="items">Items section content.</Tabs.Panel>
        <Tabs.Panel id="history">History section content.</Tabs.Panel>
    </Tabs>
);

TabsDemo.displayName = 'Tabs';

export default {
    title: 'Base/Tabs',
    component: TabsDemo,
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
                <Tabs.Tab id="general">General</Tabs.Tab>
                <Tabs.Tab id="items">Items</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel id="general">Selected: {value}</Tabs.Panel>
            <Tabs.Panel id="items">Selected: {value}</Tabs.Panel>
        </Tabs>
    );
};

export const Controlled: StoryObj<typeof TabsDemo> = {
    render: () => <ControlledTabs />,
};
