import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '../../button/index.js';
import { Field, useField } from '../../field/index.js';
import { Form } from '../../form/index.js';
import { FormInput } from '../FormInput.js';
import { type IInputProps } from '../types.js';

import Description from './Description.md';

import { InputStoryComponent } from './index.js';

const DEFAULT_ARGS: IInputProps = {
    size: 'md',
    placeholder: 'Email',
    disabled: false,
    isInvalid: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IInputProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    isInvalid: { control: { type: 'boolean' } },
};

const FieldBoundInput = (props: IInputProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <InputStoryComponent {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} {...props} />;
};

export default {
    title: 'Form/Input',
    component: InputStoryComponent,
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
                firstName: z.string().min(1, 'Обязательное поле'),
                email: z.string().email('Некорректный email'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormInput name="firstName" label="Имя" />
                <FormInput name="email" label="Email" hint="Рабочий email" placeholder="name@example.com" />
                <Button type="submit">Отправить</Button>
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

export const Disabled: StoryObj<IInputProps> = {
    args: {
        disabled: true,
        placeholder: 'Disabled',
    },
    render: Default.render,
};

export const Invalid: StoryObj<IInputProps> = {
    args: {
        isInvalid: true,
        defaultValue: 'not-an-email',
    },
    render: Default.render,
};

export const WithField: StoryObj<IInputProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field isInvalid>
                <Field.Label>Email</Field.Label>
                <FieldBoundInput placeholder="name@example.com" />
                <Field.Hint>Мы не передаём email третьим лицам</Field.Hint>
                <Field.Error>Некорректный email</Field.Error>
            </Field>
        </div>
    ),
};
