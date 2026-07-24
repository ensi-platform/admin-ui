import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field, useField } from '@/field';
import { Form } from '@/form';

import { FormSelect } from '../FormSelect';
import { type ISelectProps, type TSelectValue } from '../types';

import Description from './Description.md';

import { SelectStoryComponent } from '.';

const OPTIONS = [
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликован' },
    { value: 'archived', label: 'Архив', disabled: true },
];

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликован' },
    { value: 'archived', label: 'Архив' },
];

const ROLE_OPTIONS = [
    { value: 'admin', label: 'Админ' },
    { value: 'editor', label: 'Редактор' },
    { value: 'viewer', label: 'Читатель' },
];

const DEFAULT_ARGS: ISelectProps = {
    options: OPTIONS,
    size: 'md',
    placeholder: 'Выберите статус',
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
    const [value, setValue] = useState<TSelectValue | null>(props.value ?? props.defaultValue ?? null);

    return <SelectStoryComponent {...props} value={value} defaultValue={undefined} onChange={setValue} />;
};

export default {
    title: 'Form/Select',
    component: SelectStoryComponent,
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
} satisfies Meta<typeof SelectStoryComponent>;

export const Default: StoryObj<ISelectProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <SelectStoryComponent aria-label="Статус" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ status: '', role: '' }}
            validationSchema={z.object({
                status: z.string().min(1, 'Выберите статус'),
                role: z.string().min(1, 'Выберите роль'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormSelect name="status" label="Статус" options={STATUS_OPTIONS} clear placeholder="Выберите…" />
                <FormSelect name="role" label="Роль" options={ROLE_OPTIONS} hint="Права доступа" />
                <Button type="submit">Отправить</Button>
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
            <ControlledSelect aria-label="Статус" {...args} clear value="draft" />
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
                <Field.Label>Статус</Field.Label>
                <FieldBoundSelect placeholder="Выберите…" />
                <Field.Hint>Отображается в списке сущностей</Field.Hint>
                <Field.Error>Обязательное поле</Field.Error>
            </Field>
        </div>
    ),
};
