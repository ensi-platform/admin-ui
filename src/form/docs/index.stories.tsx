import { type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { FormInput } from '@/input';

import { Form } from '../Component';
import { type TFormProps, type TFormSubmitHandler } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

interface IStoryShape {
    firstName: string;
    email: string;
}

type TStoryFormProps = Extract<TFormProps<IStoryShape>, { onSubmit: TFormSubmitHandler<IStoryShape> }>;

const DEFAULT_ARGS: TStoryFormProps = {
    onSubmit: () => undefined,
    enableReinitialize: false,
    triggerOnReinitialize: false,
    isForm: true,
    disabled: false,
    mode: 'all',
    initialValues: {
        firstName: '',
        email: '',
    },
    validationSchema: z.object({
        firstName: z.string().min(1, 'Required field'),
        email: z.string().email('Invalid email'),
    }),
};

export default {
    title: 'Form/Form',
    component: Form,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        controls: {
            expanded: true,
        },
    },
    args: DEFAULT_ARGS,
} satisfies Meta<TStoryFormProps>;

export const Default: StoryObj<TStoryFormProps> = {
    render: args => (
        <Form {...args}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormInput name="firstName" label="Name" />
                <FormInput name="email" label="Email" />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};

export const Disabled: StoryObj<TStoryFormProps> = {
    args: {
        disabled: true,
    },
    render: Default.render,
};
