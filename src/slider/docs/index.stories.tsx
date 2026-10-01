import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Form } from '@/form';

import { FormSlider } from '../FormSlider';
import { type ISliderProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { SliderStoryComponent } from '.';

const DEFAULT_ARGS: ISliderProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    minValue: 0,
    maxValue: 100,
    step: 25,
    ticks: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ISliderProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    ticks: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: ISliderProps) => {
    const [value, setValue] = useState(50);

    return (
        <div style={{ maxWidth: 320 }}>
            <SliderStoryComponent aria-label="Scale" {...args} value={value} onChange={setValue} />
        </div>
    );
};

export default {
    title: 'Form/Slider',
    component: SliderStoryComponent,
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
} satisfies Meta<typeof SliderStoryComponent>;

export const Default: StoryObj<ISliderProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const FormField: StoryObj = {
    render: () => (
        <Form initialValues={{ scale: 50 }} onSubmit={() => undefined}>
            <FormSlider name="scale" label="Scale" minValue={0} maxValue={100} step={25} />
        </Form>
    ),
};
