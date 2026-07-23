import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type ITagProps } from '../types.js';

import Description from './Description.md';

import { TagStoryComponent } from './index.js';

const DEFAULT_ARGS: ITagProps = {
    children: 'vip',
    size: 'md',
    disabled: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ITagProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
};

export default {
    title: 'Tag',
    component: TagStoryComponent,
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
} satisfies Meta<typeof TagStoryComponent>;

export const Default: StoryObj<ITagProps> = {};

export const Removable: StoryObj<ITagProps> = {
    args: {
        onRemove: () => undefined,
        children: 'постоянный клиент',
    },
};

export const Sizes: StoryObj<ITagProps> = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TagStoryComponent size="sm" onRemove={() => undefined}>
                sm
            </TagStoryComponent>
            <TagStoryComponent size="md" onRemove={() => undefined}>
                md
            </TagStoryComponent>
        </div>
    ),
};

export const Disabled: StoryObj<ITagProps> = {
    args: {
        disabled: true,
        onRemove: () => undefined,
        children: 'vip',
    },
};
