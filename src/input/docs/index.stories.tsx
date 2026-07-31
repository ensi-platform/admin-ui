import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field, useField } from '@/field';
import { Form } from '@/form';

import { FormInput } from '../FormInput';
import { type IInputProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { InputStoryComponent } from '.';

const DEFAULT_ARGS: IInputProps = {
    size: 'md',
    placeholder: 'Email',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IInputProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const FieldBoundInput = (props: IInputProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <InputStoryComponent {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export default {
    title: 'Form/Input',
    component: InputStoryComponent,
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
} satisfies Meta<typeof InputStoryComponent>;

export const Default: StoryObj<IInputProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <InputStoryComponent aria-label="Email" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ firstName: '', email: '' }}
            validationSchema={z.object({
                firstName: z.string().min(1, 'Required field'),
                email: z.string().email('Invalid email'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormInput name="firstName" label="Name" clear />
                <FormInput name="email" label="Email" hint="Work email" placeholder="name@example.com" />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};

export const Sizes: StoryObj<IInputProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
            <InputStoryComponent aria-label="sm" size="sm" placeholder="size=sm" />
            <InputStoryComponent aria-label="md" size="md" placeholder="size=md" />
            <InputStoryComponent aria-label="lg" size="lg" placeholder="size=lg" />
        </div>
    ),
};

export const Clear: StoryObj<IInputProps> = {
    args: {
        clear: true,
        defaultValue: 'user@example.com',
    },
    render: Default.render,
};

export const Disabled: StoryObj<IInputProps> = {
    args: {
        disabled: true,
        placeholder: 'Disabled',
    },
    render: Default.render,
};

export const Invalid: StoryObj<IInputProps> = {
    args: {
        invalid: true,
        defaultValue: 'not-an-email',
    },
    render: Default.render,
};

export const WithField: StoryObj<IInputProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field invalid>
                <Field.Label>Email</Field.Label>
                <FieldBoundInput placeholder="name@example.com" />
                <Field.Hint>We do not share your email with third parties</Field.Hint>
                <Field.Error>Invalid email</Field.Error>
            </Field>
        </div>
    ),
};
