import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Field } from '@/field';
import { Form } from '@/form';

import { FormCheckbox } from '../FormCheckbox';
import { type ICheckboxProps } from '../types';

import Description from './Description.md';

import { CheckboxStoryComponent } from '.';

const DEFAULT_ARGS: ICheckboxProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    indeterminate: false,
    children: 'Согласен с условиями',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ICheckboxProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    indeterminate: { control: { type: 'boolean' } },
};

export default {
    title: 'Checkbox',
    component: CheckboxStoryComponent,
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
} satisfies Meta<typeof CheckboxStoryComponent>;

export const Default: StoryObj<ICheckboxProps> = {
    render: args => <CheckboxStoryComponent {...args} />,
};

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
    render: Default.render,
};

export const Invalid: StoryObj<ICheckboxProps> = {
    args: { invalid: true, defaultChecked: true },
    render: Default.render,
};

export const Indeterminate: StoryObj<ICheckboxProps> = {
    args: { indeterminate: true, defaultChecked: true, children: 'Выбрать все' },
    render: Default.render,
};

export const WithField: StoryObj<ICheckboxProps> = {
    render: () => (
        <Field invalid>
            <CheckboxStoryComponent>Согласен</CheckboxStoryComponent>
            <Field.Hint>Нужно согласие</Field.Hint>
            <Field.Error>Обязательное поле</Field.Error>
        </Field>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ agree: false }}
            validationSchema={z.object({
                agree: z.literal(true, { error: 'Нужно согласие' }),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormCheckbox name="agree" hint="Обязательно">
                    Согласен с условиями
                </FormCheckbox>
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};
