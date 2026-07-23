import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '../../button/index.js';
import { Field, useField } from '../../field/index.js';
import { Form } from '../../form/index.js';
import { FormTextArea } from '../FormTextArea.js';
import { type ITextAreaProps } from '../types.js';

import Description from './Description.md';

import { TextAreaStoryComponent } from './index.js';

const DEFAULT_ARGS: ITextAreaProps = {
    size: 'md',
    placeholder: 'Комментарий',
    disabled: false,
    isInvalid: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ITextAreaProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    isInvalid: { control: { type: 'boolean' } },
};

const FieldBoundTextArea = (props: ITextAreaProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return (
        <TextAreaStoryComponent {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} {...props} />
    );
};

export default {
    title: 'Form/TextArea',
    component: TextAreaStoryComponent,
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
} satisfies Meta<typeof TextAreaStoryComponent>;

export const Default: StoryObj<ITextAreaProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <TextAreaStoryComponent aria-label="Комментарий" {...args} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ comment: '', notes: '' }}
            validationSchema={z.object({
                comment: z.string().min(1, 'Обязательное поле'),
                notes: z.string().optional(),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormTextArea name="comment" label="Комментарий" />
                <FormTextArea name="notes" label="Заметки" hint="Необязательно" placeholder="…" />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};

export const Sizes: StoryObj<ITextAreaProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
            <TextAreaStoryComponent aria-label="sm" size="sm" placeholder="size=sm" />
            <TextAreaStoryComponent aria-label="md" size="md" placeholder="size=md" />
            <TextAreaStoryComponent aria-label="lg" size="lg" placeholder="size=lg" />
        </div>
    ),
};

export const Disabled: StoryObj<ITextAreaProps> = {
    args: {
        disabled: true,
        placeholder: 'Disabled',
    },
    render: Default.render,
};

export const Invalid: StoryObj<ITextAreaProps> = {
    args: {
        isInvalid: true,
        defaultValue: 'too short',
    },
    render: Default.render,
};

export const WithField: StoryObj<ITextAreaProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <Field isInvalid>
                <Field.Label>Комментарий</Field.Label>
                <FieldBoundTextArea placeholder="Опишите проблему" />
                <Field.Hint>Максимум 500 символов</Field.Hint>
                <Field.Error>Слишком коротко</Field.Error>
            </Field>
        </div>
    ),
};
