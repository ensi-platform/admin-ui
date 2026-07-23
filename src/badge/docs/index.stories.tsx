import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type IBadgeProps } from '../types.js';

import Description from './Description.md';

import { BadgeStoryComponent } from './index.js';

const DEFAULT_ARGS: IBadgeProps = {
    children: 'В сборке',
    size: 'md',
    variant: 'info',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IBadgeProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
};

export default {
    title: 'Badge',
    component: BadgeStoryComponent,
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
} satisfies Meta<typeof BadgeStoryComponent>;

export const Default: StoryObj<IBadgeProps> = {};

export const Variants: StoryObj<IBadgeProps> = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <BadgeStoryComponent variant="neutral">Черновик</BadgeStoryComponent>
            <BadgeStoryComponent variant="success">Оплачен</BadgeStoryComponent>
            <BadgeStoryComponent variant="warning">Ожидает</BadgeStoryComponent>
            <BadgeStoryComponent variant="danger">Отменён</BadgeStoryComponent>
            <BadgeStoryComponent variant="info">В сборке</BadgeStoryComponent>
        </div>
    ),
};

export const Sizes: StoryObj<IBadgeProps> = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BadgeStoryComponent size="sm" variant="success">
                sm
            </BadgeStoryComponent>
            <BadgeStoryComponent size="md" variant="success">
                md
            </BadgeStoryComponent>
        </div>
    ),
};
