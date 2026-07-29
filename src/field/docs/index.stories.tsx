import { type InputHTMLAttributes } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Field } from '../Component';
import { useField } from '../context';
import { type IFieldProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

type TFieldStoryProps = Omit<IFieldProps, 'children'> & {
    hint?: string;
    error?: string;
};

const DEFAULT_ARGS: TFieldStoryProps = {
    size: 'md',
    invalid: false,
    disabled: false,
    hint: 'Field hint',
    error: undefined,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TFieldStoryProps>> = {
    size: { control: { type: 'select' } },
    invalid: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
};

const DemoInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
    const { controlProps } = useField();

    return <input {...controlProps} {...props} style={{ width: '100%', boxSizing: 'border-box' }} />;
};

const FieldDemo = ({ hint, error, ...fieldProps }: TFieldStoryProps) => (
    <div style={{ maxWidth: 320 }}>
        <Field {...fieldProps}>
            <Field.Label>Email</Field.Label>
            <DemoInput />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    </div>
);

FieldDemo.displayName = 'Field';

export default {
    title: 'Form/Field',
    component: FieldDemo,
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
} satisfies Meta<typeof FieldDemo>;

export const Default: StoryObj<typeof FieldDemo> = {};

export const WithHint: StoryObj<typeof FieldDemo> = {
    args: {
        hint: 'We do not share your email with third parties',
    },
};

export const WithError: StoryObj<typeof FieldDemo> = {
    args: {
        invalid: true,
        error: 'Invalid email',
        hint: undefined,
    },
};

export const Disabled: StoryObj<typeof FieldDemo> = {
    args: {
        disabled: true,
    },
};

export const Sizes: StoryObj<typeof FieldDemo> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 320 }}>
            <FieldDemo size="sm" hint="size=sm" />
            <FieldDemo size="md" hint="size=md" />
            <FieldDemo size="lg" hint="size=lg" />
        </div>
    ),
};
