import { useEffect, useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { Button } from '@/button';
import { Form } from '@/form';

import { FormAutocompleteAsync } from '../FormAutocompleteAsync';
import { type IAutocompleteAsyncProps } from '../types';

import Description from './Description.md';

import { AutocompleteAsyncStoryComponent } from '.';

const ALL = [
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
    { value: 'puma', label: 'Puma' },
];

const useMockBrandSuggest: TUseAutocompleteSuggest = ({ query, enabled }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(ALL);

    useEffect(() => {
        if (!enabled) {
            setOptions([]);
            setIsLoading(false);

            return;
        }

        setIsLoading(true);
        const id = window.setTimeout(() => {
            setOptions(ALL.filter(item => item.label.toLowerCase().includes(query.toLowerCase())));
            setIsLoading(false);
        }, 120);

        return () => window.clearTimeout(id);
    }, [query, enabled]);

    return { options, isLoading };
};

const DEFAULT_ARGS: IAutocompleteAsyncProps = {
    useSuggest: useMockBrandSuggest,
    size: 'md',
    placeholder: 'Бренд…',
    disabled: false,
    invalid: false,
    clear: false,
    debounceMs: 0,
    minLength: 0,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IAutocompleteAsyncProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

export default {
    title: 'Form/Combobox/AutocompleteAsync',
    component: AutocompleteAsyncStoryComponent,
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
} satisfies Meta<typeof AutocompleteAsyncStoryComponent>;

export const Default: StoryObj<IAutocompleteAsyncProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <AutocompleteAsyncStoryComponent aria-label="Бренд" {...args} useSuggest={useMockBrandSuggest} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ brand: '' }}
            validationSchema={z.object({
                brand: z.string().min(1, 'Выберите бренд'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormAutocompleteAsync
                    name="brand"
                    label="Бренд"
                    useSuggest={useMockBrandSuggest}
                    debounceMs={0}
                    clear
                    placeholder="Начните вводить…"
                />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};
