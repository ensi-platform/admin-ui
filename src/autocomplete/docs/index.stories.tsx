import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field, useField } from '@/field';
import { Form } from '@/form';

import { FormAutocomplete } from '../FormAutocomplete';
import { type IAutocompleteProps, type TSelectValue } from '../types';

import Description from './Description.md';

import { AutocompleteStoryComponent } from '.';

const OPTIONS = [
    { value: 'msk', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'kzn', label: 'Казань', disabled: true },
];

const CITY_OPTIONS = [
    { value: 'msk', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'kzn', label: 'Казань' },
];

const DEFAULT_ARGS: IAutocompleteProps = {
    options: OPTIONS,
    size: 'md',
    placeholder: 'Начните вводить…',
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
    const [value, setValue] = useState<TSelectValue | null>(props.value ?? props.defaultValue ?? null);

    return <AutocompleteStoryComponent {...props} value={value} defaultValue={undefined} onChange={setValue} />;
};

export default {
    title: 'Form/Autocomplete',
    component: AutocompleteStoryComponent,
    parameters: {
        docs: {
            description: {
                component: Description,
            },
        },
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
            <AutocompleteStoryComponent aria-label="Город" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ city: '' }}
            validationSchema={z.object({
                city: z.string().min(1, 'Выберите город'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormAutocomplete
                    name="city"
                    label="Город"
                    options={CITY_OPTIONS}
                    clear
                    placeholder="Начните вводить…"
                />
                <Button type="submit">Отправить</Button>
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
            <ControlledAutocomplete aria-label="Город" {...args} clear value="msk" />
        </div>
    ),
};

export const WithField: StoryObj<IAutocompleteProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field invalid>
                <Field.Label>Город</Field.Label>
                <FieldBoundAutocomplete placeholder="Начните вводить…" />
                <Field.Error>Обязательное поле</Field.Error>
            </Field>
        </div>
    ),
};
