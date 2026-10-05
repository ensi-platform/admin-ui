import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { VerticalTabs } from '../Component';
import { type IVerticalTabsProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TVerticalTabsStoryProps = Omit<IVerticalTabsProps, 'children' | 'value' | 'onChange'>;

const DEFAULT_ARGS: TVerticalTabsStoryProps = {
    size: 'md',
    variant: 'primary',
    disabled: false,
    defaultValue: 'person',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TVerticalTabsStoryProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
};

const VerticalTabsDemo = (props: TVerticalTabsStoryProps) => (
    <VerticalTabs {...props}>
        <VerticalTabs.List>
            <VerticalTabs.Item id="person">Person</VerticalTabs.Item>
            <VerticalTabs.Item id="signin">Sign in</VerticalTabs.Item>
            <VerticalTabs.Item id="roles" disabled>
                Roles
            </VerticalTabs.Item>
        </VerticalTabs.List>
        <VerticalTabs.Panels>
            <VerticalTabs.Panel id="person">Person fields.</VerticalTabs.Panel>
            <VerticalTabs.Panel id="signin">Sign-in fields.</VerticalTabs.Panel>
            <VerticalTabs.Panel id="roles">Role fields.</VerticalTabs.Panel>
        </VerticalTabs.Panels>
    </VerticalTabs>
);

VerticalTabsDemo.displayName = 'VerticalTabs';

export default {
    title: 'Base/VerticalTabs',
    component: VerticalTabsDemo,
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
} satisfies Meta<typeof VerticalTabsDemo>;

export const Default: StoryObj<typeof VerticalTabsDemo> = {};

export const Sizes: StoryObj<typeof VerticalTabsDemo> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <VerticalTabsDemo size="sm" defaultValue="person" />
            <VerticalTabsDemo size="md" defaultValue="person" />
            <VerticalTabsDemo size="lg" defaultValue="person" />
        </div>
    ),
};

export const Disabled: StoryObj<typeof VerticalTabsDemo> = {
    args: {
        disabled: true,
    },
};

const ControlledTabs = () => {
    const [value, setValue] = useState('person');

    return (
        <VerticalTabs value={value} onChange={setValue}>
            <VerticalTabs.List>
                <VerticalTabs.Item id="person">Person</VerticalTabs.Item>
                <VerticalTabs.Item id="signin">Sign in</VerticalTabs.Item>
            </VerticalTabs.List>
            <VerticalTabs.Panels>
                <VerticalTabs.Panel id="person">Selected: {value}</VerticalTabs.Panel>
                <VerticalTabs.Panel id="signin">Selected: {value}</VerticalTabs.Panel>
            </VerticalTabs.Panels>
        </VerticalTabs>
    );
};

export const Controlled: StoryObj<typeof VerticalTabsDemo> = {
    render: () => <ControlledTabs />,
};
