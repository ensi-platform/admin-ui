import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type IBadgeProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { BadgeStoryComponent } from '.';

const DEFAULT_ARGS: IBadgeProps = {
    children: 'In progress',
    size: 'md',
    variant: 'info',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IBadgeProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
};

export default {
    title: 'Base/Badge',
    component: BadgeStoryComponent,
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
} satisfies Meta<typeof BadgeStoryComponent>;

export const Default: StoryObj<IBadgeProps> = {};

export const Variants: StoryObj<IBadgeProps> = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <BadgeStoryComponent variant="neutral">Draft</BadgeStoryComponent>
            <BadgeStoryComponent variant="success">Paid</BadgeStoryComponent>
            <BadgeStoryComponent variant="warning">Pending</BadgeStoryComponent>
            <BadgeStoryComponent variant="danger">Cancelled</BadgeStoryComponent>
            <BadgeStoryComponent variant="info">In progress</BadgeStoryComponent>
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
