import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field } from '@/field';
import { Form } from '@/form';

import { FormCheckbox } from '../FormCheckbox';
import { type ICheckboxProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { CheckboxStoryComponent } from '.';

const DEFAULT_ARGS: ICheckboxProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    indeterminate: false,
    children: 'I agree to the terms',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ICheckboxProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    indeterminate: { control: { type: 'boolean' } },
};

export default {
    title: 'Form/Checkbox',
    component: CheckboxStoryComponent,
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
} satisfies Meta<typeof CheckboxStoryComponent>;

export const Default: StoryObj<ICheckboxProps> = {};

export const Sizes: StoryObj<ICheckboxProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CheckboxStoryComponent size="sm">size=sm</CheckboxStoryComponent>
            <CheckboxStoryComponent size="md">size=md</CheckboxStoryComponent>
            <CheckboxStoryComponent size="lg">size=lg</CheckboxStoryComponent>
        </div>
    ),
};

export const Disabled: StoryObj<ICheckboxProps> = {
    args: { disabled: true },
};

export const Invalid: StoryObj<ICheckboxProps> = {
    args: { invalid: true, defaultChecked: true },
};

export const Indeterminate: StoryObj<ICheckboxProps> = {
    args: { indeterminate: true, defaultChecked: true, children: 'Select all' },
};

export const WithField: StoryObj<ICheckboxProps> = {
    render: () => (
        <Field invalid>
            <CheckboxStoryComponent>I agree</CheckboxStoryComponent>
            <Field.Hint>Consent required</Field.Hint>
            <Field.Error>Required field</Field.Error>
        </Field>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ agree: false }}
            validationSchema={z.object({
                agree: z.literal(true, { error: 'Consent required' }),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormCheckbox name="agree" hint="Required">
                    I agree to the terms
                </FormCheckbox>
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};
