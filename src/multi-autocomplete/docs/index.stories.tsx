import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormMultiAutocomplete } from '../FormMultiAutocomplete';
import { type IMultiAutocompleteProps, type TComboboxValue } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

import { MultiAutocompleteStoryComponent } from '.';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'regular customer' },
    { value: 'wholesale', label: 'wholesale' },
    { value: 'new', label: 'new' },
    { value: 'blocked', label: 'blocked' },
];

const DEFAULT_ARGS: IMultiAutocompleteProps = {
    options: OPTIONS,
    size: 'md',
    placeholder: 'Tags…',
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
    const [value, setValue] = useState<TComboboxValue[]>(props.value ?? props.defaultValue ?? []);

    return <MultiAutocompleteStoryComponent {...props} value={value} defaultValue={undefined} onChange={setValue} />;
};

export default {
    title: 'Form/Combobox/MultiAutocomplete',
    component: MultiAutocompleteStoryComponent,
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
} satisfies Meta<typeof MultiAutocompleteStoryComponent>;

export const Default: StoryObj<IMultiAutocompleteProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <MultiAutocompleteStoryComponent aria-label="Tags" {...args} />
        </div>
    ),
};

export const WithOverflow: StoryObj<IMultiAutocompleteProps> = {
    render: args => (
        <div style={{ maxWidth: 240 }}>
            <Controlled aria-label="Tags" {...args} clear value={['vip', 'regular', 'wholesale', 'new', 'blocked']} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ tags: [] as string[] }}
            validationSchema={z.object({
                tags: z.array(z.string()).min(1, 'Select tags'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormMultiAutocomplete
                    name="tags"
                    label="Tags"
                    options={OPTIONS}
                    clear
                    placeholder="Start typing…"
                />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};
