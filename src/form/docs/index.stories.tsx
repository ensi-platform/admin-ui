import { type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '../../button/index.js';
import { FormInput } from '../../input/index.js';
import { Form } from '../Component.js';
import { type TFormProps, type TFormSubmitHandler } from '../types.js';

import Description from './Description.md';

interface IStoryShape {
    firstName: string;
    email: string;
}

type TStoryFormProps = Extract<TFormProps<IStoryShape>, { onSubmit: TFormSubmitHandler<IStoryShape> }>;

const DEFAULT_ARGS: TStoryFormProps = {
    onSubmit: () => undefined,
    enableReinitialize: false,
    triggerOnReinitialize: false,
    isForm: true,
    disabled: false,
    mode: 'all',
    initialValues: {
        firstName: '',
        email: '',
    },
    validationSchema: z.object({
        firstName: z.string().min(1, 'Обязательное поле'),
        email: z.string().email('Некорректный email'),
    }),
};

export default {
    title: 'Form/Form',
    component: Form,
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
} satisfies Meta<TStoryFormProps>;

export const Default: StoryObj<TStoryFormProps> = {
    render: args => (
        <Form {...args}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormInput name="firstName" label="Имя" />
                <FormInput name="email" label="Email" />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};

export const Disabled: StoryObj<TStoryFormProps> = {
    args: {
        disabled: true,
    },
    render: Default.render,
};
