import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type IColorPickerProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { ColorPickerStoryComponent } from '.';

const PRESETS = ['#171717', '#ffffff', '#dc2626', '#16a34a', '#2563eb'];

const DEFAULT_ARGS: IColorPickerProps = {
    disabled: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IColorPickerProps>> = {
    disabled: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: IColorPickerProps) => {
    const [value, setValue] = useState('#2563eb');

    return (
        <div style={{ width: 240 }}>
            <ColorPickerStoryComponent {...args} value={value} onChange={setValue} />
        </div>
    );
};

export default {
    title: 'Form/ColorPicker',
    component: ColorPickerStoryComponent,
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
} satisfies Meta<typeof ColorPickerStoryComponent>;

export const Default: StoryObj<IColorPickerProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const WithPresets: StoryObj<IColorPickerProps> = {
    render: args => <DefaultDemo {...args} presets={PRESETS} />,
};

export const Disabled: StoryObj<IColorPickerProps> = {
    args: { disabled: true },
    render: args => <DefaultDemo {...args} />,
};
