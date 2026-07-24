import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field } from '@/field';
import { Form } from '@/form';

import { FormSwitch } from '../FormSwitch';
import { type ISwitchProps } from '../types';

import Description from './Description.md';

import { SwitchStoryComponent } from '.';

const DEFAULT_ARGS: ISwitchProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    children: 'Уведомления',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ISwitchProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
};

export default {
    title: 'Switch',
    component: SwitchStoryComponent,
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
} satisfies Meta<typeof SwitchStoryComponent>;

export const Default: StoryObj<ISwitchProps> = {
    render: args => <SwitchStoryComponent {...args} />,
};

export const Sizes: StoryObj<ISwitchProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SwitchStoryComponent size="sm">size=sm</SwitchStoryComponent>
            <SwitchStoryComponent size="md">size=md</SwitchStoryComponent>
            <SwitchStoryComponent size="lg">size=lg</SwitchStoryComponent>
        </div>
    ),
};

export const Disabled: StoryObj<ISwitchProps> = {
    args: { disabled: true },
    render: Default.render,
};

export const Invalid: StoryObj<ISwitchProps> = {
    args: { invalid: true, defaultChecked: true },
    render: Default.render,
};

export const WithField: StoryObj<ISwitchProps> = {
    render: () => (
        <Field invalid>
            <SwitchStoryComponent>Уведомления</SwitchStoryComponent>
            <Field.Hint>Рекомендуем включить</Field.Hint>
            <Field.Error>Обязательно</Field.Error>
        </Field>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ enabled: false }}
            validationSchema={z.object({
                enabled: z.literal(true, { error: 'Включите' }),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormSwitch name="enabled" hint="Можно изменить позже">
                    Включено
                </FormSwitch>
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};
