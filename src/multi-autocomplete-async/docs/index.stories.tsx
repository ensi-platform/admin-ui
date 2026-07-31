import { useEffect, useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { Button } from '@/button';
import { Form } from '@/form';

import { FormMultiAutocompleteAsync } from '../FormMultiAutocompleteAsync';
import { type IMultiAutocompleteAsyncProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { MultiAutocompleteAsyncStoryComponent } from '.';

const ALL = [
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
    { value: 'puma', label: 'Puma' },
    { value: 'reebok', label: 'Reebok' },
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

export default {
    title: 'Form/Combobox/MultiAutocompleteAsync',
    component: MultiAutocompleteAsyncStoryComponent,
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
    },
    args: {
        useSuggest: useMockBrandSuggest,
        debounceMs: 0,
        placeholder: 'Brands…',
        clear: true,
    },
} satisfies Meta<typeof MultiAutocompleteAsyncStoryComponent>;

export const Default: StoryObj<IMultiAutocompleteAsyncProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <MultiAutocompleteAsyncStoryComponent aria-label="Brands" {...args} useSuggest={useMockBrandSuggest} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ brands: [] as string[] }}
            validationSchema={z.object({
                brands: z.array(z.string()).min(1, 'Select brands'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormMultiAutocompleteAsync
                    name="brands"
                    label="Brands"
                    useSuggest={useMockBrandSuggest}
                    debounceMs={0}
                    clear
                />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};
