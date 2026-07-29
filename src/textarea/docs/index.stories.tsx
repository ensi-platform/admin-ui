import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field, useField } from '@/field';
import { Form } from '@/form';

import { FormTextArea } from '../FormTextArea';
import { type ITextAreaProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

import { TextAreaStoryComponent } from '.';

const DEFAULT_ARGS: ITextAreaProps = {
    size: 'md',
    placeholder: 'Comment',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ITextAreaProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const FieldBoundTextArea = (props: ITextAreaProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <TextAreaStoryComponent {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export default {
    title: 'Form/TextArea',
    component: TextAreaStoryComponent,
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
} satisfies Meta<typeof TextAreaStoryComponent>;

export const Default: StoryObj<ITextAreaProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <TextAreaStoryComponent aria-label="Comment" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ comment: '', notes: '' }}
            validationSchema={z.object({
                comment: z.string().min(1, 'Required field'),
                notes: z.string().optional(),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormTextArea name="comment" label="Comment" clear />
                <FormTextArea name="notes" label="Notes" hint="Optional" placeholder="…" />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};

export const Sizes: StoryObj<ITextAreaProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
            <TextAreaStoryComponent aria-label="sm" size="sm" placeholder="size=sm" />
            <TextAreaStoryComponent aria-label="md" size="md" placeholder="size=md" />
            <TextAreaStoryComponent aria-label="lg" size="lg" placeholder="size=lg" />
        </div>
    ),
};

export const Clear: StoryObj<ITextAreaProps> = {
    args: {
        clear: true,
        defaultValue: 'Comment draft',
    },
    render: Default.render,
};

export const Disabled: StoryObj<ITextAreaProps> = {
    args: {
        disabled: true,
        placeholder: 'Disabled',
    },
    render: Default.render,
};

export const Invalid: StoryObj<ITextAreaProps> = {
    args: {
        invalid: true,
        defaultValue: 'too short',
    },
    render: Default.render,
};

export const WithField: StoryObj<ITextAreaProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field invalid>
                <Field.Label>Comment</Field.Label>
                <FieldBoundTextArea placeholder="Describe the issue" />
                <Field.Hint>Maximum 500 characters</Field.Hint>
                <Field.Error>Too short</Field.Error>
            </Field>
        </div>
    ),
};
