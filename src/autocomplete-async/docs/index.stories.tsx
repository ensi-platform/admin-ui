import { useEffect, useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { type TUseAutocompleteSuggest, type IAutocompleteAsyncProps } from '@/autocomplete-async/types';
import { Button } from '@/button';
import { Form } from '@/form';

import { FormAutocompleteAsync } from '../FormAutocompleteAsync';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

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
    placeholder: 'Brand…',
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
} satisfies Meta<typeof AutocompleteAsyncStoryComponent>;

export const Default: StoryObj<IAutocompleteAsyncProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <AutocompleteAsyncStoryComponent aria-label="Brand" {...args} useSuggest={useMockBrandSuggest} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ brand: '' }}
            validationSchema={z.object({
                brand: z.string().min(1, 'Select a brand'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormAutocompleteAsync
                    name="brand"
                    label="Brand"
                    useSuggest={useMockBrandSuggest}
                    debounceMs={0}
                    clear
                    placeholder="Start typing…"
                />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};
