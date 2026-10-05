import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { GridLayout } from '../Component';
import { type IGridLayoutProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TGridLayoutStoryProps = Omit<IGridLayoutProps, 'children'>;

const DEFAULT_ARGS: TGridLayoutStoryProps = {
    cols: 2,
    gap: 16,
    align: 'stretch',
    hidden: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TGridLayoutStoryProps>> = {
    cols: { control: { type: 'number' } },
    gap: { control: { type: 'select' }, options: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64] },
    align: { control: { type: 'select' } },
    hidden: { control: { type: 'boolean' } },
};

const GridLayoutDemo = ({ cols, ...props }: TGridLayoutStoryProps) => (
    <GridLayout {...props} cols={cols}>
        <div>First</div>
        <div>Second</div>
        <GridLayout.Item col="full">Full width</GridLayout.Item>
    </GridLayout>
);

GridLayoutDemo.displayName = 'GridLayout';

export default {
    title: 'Base/GridLayout',
    component: GridLayoutDemo,
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
} satisfies Meta<typeof GridLayoutDemo>;

export const Default: StoryObj<typeof GridLayoutDemo> = {};

export const Split: StoryObj<typeof GridLayoutDemo> = {
    args: {
        cols: ['minmax(0, 1fr)', '16.25rem'],
        gap: 24,
    },
    render: args => (
        <GridLayout {...args}>
            <div>Main</div>
            <div>Aside</div>
        </GridLayout>
    ),
};
