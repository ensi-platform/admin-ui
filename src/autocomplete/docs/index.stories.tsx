import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field, useField } from '@/field';
import { Form } from '@/form';

import { FormAutocomplete } from '../FormAutocomplete';
import { type IAutocompleteProps, type TComboboxValue } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

import { AutocompleteStoryComponent } from '.';

const OPTIONS = [
    { value: 'msk', label: 'Moscow' },
    { value: 'spb', label: 'Saint Petersburg' },
    { value: 'kzn', label: 'Kazan', disabled: true },
];

const CITY_OPTIONS = [
    { value: 'msk', label: 'Moscow' },
    { value: 'spb', label: 'Saint Petersburg' },
    { value: 'kzn', label: 'Kazan' },
];

const DEFAULT_ARGS: IAutocompleteProps = {
    options: OPTIONS,
    size: 'md',
    placeholder: 'Start typing…',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IAutocompleteProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const FieldBoundAutocomplete = (props: Omit<IAutocompleteProps, 'options'>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <AutocompleteStoryComponent
            {...controlProps}
            options={OPTIONS}
            size={size}
            invalid={invalid}
            disabled={disabled}
            {...props}
        />
    );
};

const ControlledAutocomplete = (props: IAutocompleteProps) => {
    const [value, setValue] = useState<TComboboxValue | null>(props.value ?? props.defaultValue ?? null);

    return <AutocompleteStoryComponent {...props} value={value} defaultValue={undefined} onChange={setValue} />;
};

export default {
    title: 'Form/Combobox/Autocomplete',
    component: AutocompleteStoryComponent,
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
} satisfies Meta<typeof AutocompleteStoryComponent>;

export const Default: StoryObj<IAutocompleteProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <AutocompleteStoryComponent aria-label="City" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ city: '' }}
            validationSchema={z.object({
                city: z.string().min(1, 'Select a city'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormAutocomplete
                    name="city"
                    label="City"
                    options={CITY_OPTIONS}
                    clear
                    placeholder="Start typing…"
                />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};

export const Loading: StoryObj<IAutocompleteProps> = {
    args: {
        options: [],
        isLoading: true,
        clientFilter: false,
    },
    render: Default.render,
};

export const Clear: StoryObj<IAutocompleteProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <ControlledAutocomplete aria-label="City" {...args} clear value="msk" />
        </div>
    ),
};

export const WithField: StoryObj<IAutocompleteProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field invalid>
                <Field.Label>City</Field.Label>
                <FieldBoundAutocomplete placeholder="Start typing…" />
                <Field.Error>Required field</Field.Error>
            </Field>
        </div>
    ),
};
