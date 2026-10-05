import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { FlexLayout } from '../Component';
import { type IFlexLayoutProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TFlexLayoutStoryProps = Omit<IFlexLayoutProps, 'children'>;

const DEFAULT_ARGS: TFlexLayoutStoryProps = {
    direction: 'row',
    gap: 16,
    align: 'stretch',
    justify: 'start',
    wrap: false,
    hidden: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TFlexLayoutStoryProps>> = {
    direction: { control: { type: 'select' } },
    gap: { control: { type: 'select' }, options: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64] },
    align: { control: { type: 'select' } },
    justify: { control: { type: 'select' } },
    wrap: { control: { type: 'boolean' } },
    hidden: { control: { type: 'boolean' } },
};

const FlexLayoutDemo = (props: TFlexLayoutStoryProps) => (
    <FlexLayout {...props}>
        <FlexLayout.Item grow>Title</FlexLayout.Item>
        <div>Cancel</div>
        <div>Save</div>
    </FlexLayout>
);

FlexLayoutDemo.displayName = 'FlexLayout';

export default {
    title: 'Base/FlexLayout',
    component: FlexLayoutDemo,
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
} satisfies Meta<typeof FlexLayoutDemo>;

export const Default: StoryObj<typeof FlexLayoutDemo> = {};

export const Between: StoryObj<typeof FlexLayoutDemo> = {
    args: {
        align: 'center',
        justify: 'between',
    },
};

export const Column: StoryObj<typeof FlexLayoutDemo> = {
    args: {
        direction: 'column',
        align: 'start',
        gap: 8,
    },
};
