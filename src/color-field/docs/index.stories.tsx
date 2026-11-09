import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormColorField } from '../FormColorField';
import { type IColorFieldProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { ColorFieldStoryComponent } from '.';

const PRESETS = ['#171717', '#ffffff', '#dc2626', '#16a34a', '#2563eb'];

const DEFAULT_ARGS: IColorFieldProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    clear: false,
    block: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IColorFieldProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
    block: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: IColorFieldProps) => {
    const [value, setValue] = useState('#2563eb');

    return (
        <div style={{ maxWidth: 320 }}>
            <ColorFieldStoryComponent aria-label="Color" {...args} value={value} onChange={setValue} />
        </div>
    );
};

export default {
    title: 'Form/ColorField',
    component: ColorFieldStoryComponent,
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
} satisfies Meta<typeof ColorFieldStoryComponent>;

export const Default: StoryObj<IColorFieldProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const Sizes: StoryObj<IColorFieldProps> = {
    render: args => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
            <DefaultDemo {...args} size="sm" />
            <DefaultDemo {...args} size="md" />
            <DefaultDemo {...args} size="lg" />
        </div>
    ),
};

const EmptyDemo = (args: IColorFieldProps) => {
    const [value, setValue] = useState('');

    return (
        <div style={{ maxWidth: 320 }}>
            <ColorFieldStoryComponent aria-label="Color" {...args} clear value={value} onChange={setValue} />
        </div>
    );
};

export const Empty: StoryObj<IColorFieldProps> = {
    render: args => <EmptyDemo {...args} />,
};

export const WithPresets: StoryObj<IColorFieldProps> = {
    render: args => <DefaultDemo {...args} clear presets={PRESETS} />,
};

export const Disabled: StoryObj<IColorFieldProps> = {
    args: { disabled: true },
    render: args => <DefaultDemo {...args} />,
};

export const Invalid: StoryObj<IColorFieldProps> = {
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
                <FormColorField name="backgroundColor" label="Background" clear presets={PRESETS} />
                <Button type="submit">Save</Button>
            </div>
        </Form>
    ),
};
