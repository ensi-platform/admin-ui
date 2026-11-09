import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormColorPicker } from '../FormColorPicker';
import { type IColorPickerProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { ColorPickerStoryComponent } from '.';

const PRESETS = ['#171717', '#ffffff', '#dc2626', '#16a34a', '#2563eb'];

const DEFAULT_ARGS: IColorPickerProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    clear: false,
    block: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IColorPickerProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
    block: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: IColorPickerProps) => {
    const [value, setValue] = useState('#2563eb');

    return (
        <div style={{ maxWidth: 320 }}>
            <ColorPickerStoryComponent aria-label="Color" {...args} value={value} onChange={setValue} />
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

export const Sizes: StoryObj<IColorPickerProps> = {
    render: args => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
            <DefaultDemo {...args} size="sm" />
            <DefaultDemo {...args} size="md" />
            <DefaultDemo {...args} size="lg" />
        </div>
    ),
};

const EmptyDemo = (args: IColorPickerProps) => {
    const [value, setValue] = useState('');

    return (
        <div style={{ maxWidth: 320 }}>
            <ColorPickerStoryComponent aria-label="Color" {...args} clear value={value} onChange={setValue} />
        </div>
    );
};

export const Empty: StoryObj<IColorPickerProps> = {
    render: args => <EmptyDemo {...args} />,
};

export const WithPresets: StoryObj<IColorPickerProps> = {
    render: args => <DefaultDemo {...args} clear presets={PRESETS} />,
};

export const Disabled: StoryObj<IColorPickerProps> = {
    args: { disabled: true },
    render: args => <DefaultDemo {...args} />,
};

export const Invalid: StoryObj<IColorPickerProps> = {
    args: { invalid: true },
    render: args => <DefaultDemo {...args} />,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ backgroundColor: '#171717' }}
            validationSchema={z.object({
                backgroundColor: z.string().min(1, 'Required field'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormColorPicker name="backgroundColor" label="Background" clear presets={PRESETS} />
                <Button type="submit">Save</Button>
            </div>
        </Form>
    ),
};
