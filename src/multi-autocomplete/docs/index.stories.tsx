import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormMultiAutocomplete } from '../FormMultiAutocomplete';
import { type IMultiAutocompleteProps, type TSelectValue } from '../types';

import Description from './Description.md';

import { MultiAutocompleteStoryComponent } from '.';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
    { value: 'wholesale', label: 'опт' },
    { value: 'new', label: 'новый' },
    { value: 'blocked', label: 'заблокирован' },
];

const DEFAULT_ARGS: IMultiAutocompleteProps = {
    options: OPTIONS,
    size: 'md',
    placeholder: 'Метки…',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IMultiAutocompleteProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const Controlled = (props: IMultiAutocompleteProps) => {
    const [value, setValue] = useState<TSelectValue[]>(props.value ?? props.defaultValue ?? []);

    return <MultiAutocompleteStoryComponent {...props} value={value} defaultValue={undefined} onChange={setValue} />;
};

export default {
    title: 'Form/MultiAutocomplete',
    component: MultiAutocompleteStoryComponent,
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
} satisfies Meta<typeof MultiAutocompleteStoryComponent>;

export const Default: StoryObj<IMultiAutocompleteProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <MultiAutocompleteStoryComponent aria-label="Метки" {...args} />
        </div>
    ),
};

export const WithOverflow: StoryObj<IMultiAutocompleteProps> = {
    render: args => (
        <div style={{ maxWidth: 240 }}>
            <Controlled aria-label="Метки" {...args} clear value={['vip', 'regular', 'wholesale', 'new', 'blocked']} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ tags: [] as string[] }}
            validationSchema={z.object({
                tags: z.array(z.string()).min(1, 'Выберите метки'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormMultiAutocomplete
                    name="tags"
                    label="Метки"
                    options={OPTIONS}
                    clear
                    placeholder="Начните вводить…"
                />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};
