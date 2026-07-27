import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field, useField } from '@/field';
import { Form } from '@/form';

import { FormMultiSelect } from '../FormMultiSelect';
import { type IMultiSelectProps, type TComboboxValue } from '../types';

import Description from './Description.md';

import { MultiSelectStoryComponent } from '.';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
    { value: 'wholesale', label: 'опт', disabled: true },
];

const TAG_OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
    { value: 'new', label: 'новый' },
];

const DEFAULT_ARGS: IMultiSelectProps = {
    options: OPTIONS,
    size: 'md',
    placeholder: 'Выберите метки',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IMultiSelectProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const FieldBoundMultiSelect = (props: Omit<IMultiSelectProps, 'options'>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <MultiSelectStoryComponent
            {...controlProps}
            options={OPTIONS}
            size={size}
            invalid={invalid}
            disabled={disabled}
            {...props}
        />
    );
};

const ControlledMultiSelect = (props: IMultiSelectProps) => {
    const [value, setValue] = useState<TComboboxValue[]>(props.value ?? props.defaultValue ?? []);

    return <MultiSelectStoryComponent {...props} value={value} defaultValue={undefined} onChange={setValue} />;
};

export default {
    title: 'Form/Combobox/MultiSelect',
    component: MultiSelectStoryComponent,
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
} satisfies Meta<typeof MultiSelectStoryComponent>;

export const Default: StoryObj<IMultiSelectProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <MultiSelectStoryComponent aria-label="Метки" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ tags: [] as string[] }}
            validationSchema={z.object({
                tags: z.array(z.string()).min(1, 'Выберите хотя бы одну метку'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormMultiSelect name="tags" label="Метки" options={TAG_OPTIONS} clear placeholder="Выберите…" />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};

export const Sizes: StoryObj<IMultiSelectProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
            <MultiSelectStoryComponent aria-label="sm" size="sm" options={OPTIONS} placeholder="size=sm" />
            <MultiSelectStoryComponent aria-label="md" size="md" options={OPTIONS} placeholder="size=md" />
            <MultiSelectStoryComponent aria-label="lg" size="lg" options={OPTIONS} placeholder="size=lg" />
        </div>
    ),
};

export const Clear: StoryObj<IMultiSelectProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <ControlledMultiSelect aria-label="Метки" {...args} clear value={['vip', 'regular']} />
        </div>
    ),
};

export const Disabled: StoryObj<IMultiSelectProps> = {
    args: {
        disabled: true,
        defaultValue: ['vip'],
    },
    render: Default.render,
};

export const Invalid: StoryObj<IMultiSelectProps> = {
    args: {
        invalid: true,
        defaultValue: ['vip'],
    },
    render: Default.render,
};

export const WithField: StoryObj<IMultiSelectProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field invalid>
                <Field.Label>Метки</Field.Label>
                <FieldBoundMultiSelect placeholder="Выберите…" />
                <Field.Hint>Можно выбрать несколько</Field.Hint>
                <Field.Error>Обязательное поле</Field.Error>
            </Field>
        </div>
    ),
};
