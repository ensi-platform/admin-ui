import { useEffect, useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/suggest';
import { Button } from '@/button';
import { Form } from '@/form';

import { FormMultiAutocompleteAsync } from '../FormMultiAutocompleteAsync';
import { type IMultiAutocompleteAsyncProps } from '../types';

import Description from './Description.md';

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
        docs: {
            description: {
                component: Description,
            },
        },
    },
    args: {
        useSuggest: useMockBrandSuggest,
        debounceMs: 0,
        placeholder: 'Бренды…',
        clear: true,
    },
} satisfies Meta<typeof MultiAutocompleteAsyncStoryComponent>;

export const Default: StoryObj<IMultiAutocompleteAsyncProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <MultiAutocompleteAsyncStoryComponent aria-label="Бренды" {...args} useSuggest={useMockBrandSuggest} />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ brands: [] as string[] }}
            validationSchema={z.object({
                brands: z.array(z.string()).min(1, 'Выберите бренды'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormMultiAutocompleteAsync
                    name="brands"
                    label="Бренды"
                    useSuggest={useMockBrandSuggest}
                    debounceMs={0}
                    clear
                />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};
