import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Grid } from '../Component';
import { type IGridProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TGridStoryProps = Omit<IGridProps, 'children'>;

const DEFAULT_ARGS: TGridStoryProps = {
    cols: 2,
    gap: 16,
    align: 'stretch',
    hidden: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TGridStoryProps>> = {
    cols: { control: { type: 'number' } },
    gap: { control: { type: 'select' }, options: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64] },
    align: { control: { type: 'select' } },
    hidden: { control: { type: 'boolean' } },
};

const GridDemo = ({ cols, ...props }: TGridStoryProps) => (
    <Grid {...props} cols={cols}>
        <div>First</div>
        <div>Second</div>
        <Grid.Item col="full">Full width</Grid.Item>
    </Grid>
);

GridDemo.displayName = 'Grid';

export default {
    title: 'Base/Grid',
    component: GridDemo,
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
} satisfies Meta<typeof GridDemo>;

export const Default: StoryObj<typeof GridDemo> = {};

export const Split: StoryObj<typeof GridDemo> = {
    args: {
        cols: ['minmax(0, 1fr)', '16.25rem'],
        gap: 24,
    },
    render: args => (
        <Grid {...args}>
            <div>Main</div>
            <div>Aside</div>
        </Grid>
    ),
};
