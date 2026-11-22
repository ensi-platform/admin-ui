import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Form } from '@/form';

import { FormRating } from '../FormRating';
import { type IRatingProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { RatingStoryComponent } from '.';

const DEFAULT_ARGS: IRatingProps = {
    size: 'md',
    variant: 'primary',
    disabled: false,
    invalid: false,
    readOnly: false,
    minValue: 0,
    maxValue: 5,
    step: 0.5,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IRatingProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: IRatingProps) => {
    const [value, setValue] = useState(3);

    return <RatingStoryComponent aria-label="Score" {...args} value={value} onChange={setValue} />;
};

export default {
    title: 'Form/Rating',
    component: RatingStoryComponent,
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
} satisfies Meta<typeof RatingStoryComponent>;

export const Default: StoryObj<IRatingProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const Half: StoryObj<IRatingProps> = {
    render: () => <RatingStoryComponent aria-label="Score" value={3.5} />,
};

export const ReadOnly: StoryObj<IRatingProps> = {
    render: () => <RatingStoryComponent aria-label="Score" value={4} readOnly />,
};

export const Disabled: StoryObj<IRatingProps> = {
    render: () => <RatingStoryComponent aria-label="Score" value={2} disabled />,
};

export const Invalid: StoryObj<IRatingProps> = {
    render: () => <RatingStoryComponent aria-label="Score" value={1} invalid />,
};

export const Sizes: StoryObj<IRatingProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <RatingStoryComponent aria-label="Small score" size="sm" value={4} />
            <RatingStoryComponent aria-label="Medium score" size="md" value={4} />
            <RatingStoryComponent aria-label="Large score" size="lg" value={4} />
        </div>
    ),
};

export const FormField: StoryObj = {
    render: () => (
        <Form initialValues={{ score: 4 }} onSubmit={() => undefined}>
            <FormRating name="score" label="Score" hint="From 0 to 5" />
        </Form>
    ),
};
