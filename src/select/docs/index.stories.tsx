import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field, useField } from '@/field';
import { Form } from '@/form';

import { FormSelect } from '../FormSelect';
import { type ISelectProps, type TComboboxValue } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

import { SelectStoryComponent } from '.';

const OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived', disabled: true },
];

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
];

const ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
];

const DEFAULT_ARGS: ISelectProps = {
    options: OPTIONS,
    size: 'md',
    placeholder: 'Select status',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ISelectProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const FieldBoundSelect = (props: Omit<ISelectProps, 'options'>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <SelectStoryComponent
            {...controlProps}
            options={OPTIONS}
            size={size}
            invalid={invalid}
            disabled={disabled}
            {...props}
        />
    );
};

const ControlledSelect = (props: ISelectProps) => {
    const [value, setValue] = useState<TComboboxValue | null>(props.value ?? props.defaultValue ?? null);

    return <SelectStoryComponent {...props} value={value} defaultValue={undefined} onChange={setValue} />;
};

export default {
    title: 'Form/Combobox/Select',
    component: SelectStoryComponent,
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
} satisfies Meta<typeof SelectStoryComponent>;

export const Default: StoryObj<ISelectProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <SelectStoryComponent aria-label="Status" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ status: '', role: '' }}
            validationSchema={z.object({
                status: z.string().min(1, 'Select status'),
                role: z.string().min(1, 'Select role'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormSelect name="status" label="Status" options={STATUS_OPTIONS} clear placeholder="Select…" />
                <FormSelect name="role" label="Role" options={ROLE_OPTIONS} hint="Access rights" />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};

export const Sizes: StoryObj<ISelectProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
            <SelectStoryComponent aria-label="sm" size="sm" options={OPTIONS} placeholder="size=sm" />
            <SelectStoryComponent aria-label="md" size="md" options={OPTIONS} placeholder="size=md" />
            <SelectStoryComponent aria-label="lg" size="lg" options={OPTIONS} placeholder="size=lg" />
        </div>
    ),
};

export const Clear: StoryObj<ISelectProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <ControlledSelect aria-label="Status" {...args} clear value="draft" />
        </div>
    ),
};

export const Disabled: StoryObj<ISelectProps> = {
    args: {
        disabled: true,
        defaultValue: 'draft',
    },
    render: Default.render,
};

export const Invalid: StoryObj<ISelectProps> = {
    args: {
        invalid: true,
        defaultValue: 'draft',
    },
    render: Default.render,
};

export const WithField: StoryObj<ISelectProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field invalid>
                <Field.Label>Status</Field.Label>
                <FieldBoundSelect placeholder="Select…" />
                <Field.Hint>Shown in the entity list</Field.Hint>
                <Field.Error>Required field</Field.Error>
            </Field>
        </div>
    ),
};
