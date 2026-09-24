import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type IUseAutocompleteSuggest } from '@/autocomplete-async/types';

import { type ISuggestChecklistProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { SuggestChecklistStoryComponent } from '.';

const OPTIONS = [
    { value: 'moscow', label: 'Moscow' },
    { value: 'kazan', label: 'Kazan' },
    { value: 'spb', label: 'SPb' },
];

const useCitySuggest: IUseAutocompleteSuggest = ({ query, enabled }) => {
    if (!enabled) {
        return { options: [], isLoading: false, hasMore: false };
    }

    return {
        options: OPTIONS.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
        isLoading: false,
        hasMore: false,
    };
};

const DEFAULT_ARGS: ISuggestChecklistProps = {
    useSuggest: useCitySuggest,
    debounceMs: 0,
    placeholder: 'Search',
    'aria-label': 'City',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ISuggestChecklistProps>> = {
    placeholder: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    debounceMs: { control: { type: 'number' } },
};

export default {
    title: 'Form/Combobox/SuggestChecklist',
    component: SuggestChecklistStoryComponent,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        controls: { expanded: true },
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof SuggestChecklistStoryComponent>;

type TStory = StoryObj<typeof SuggestChecklistStoryComponent>;

export const Default: TStory = {};

const LONG_OPTIONS = Array.from({ length: 40 }, (_, index) => ({
    value: `city-${index + 1}`,
    label: `City ${index + 1}`,
}));

const useLongCitySuggest: IUseAutocompleteSuggest = ({ query, enabled }) => {
    if (!enabled) {
        return { options: [], isLoading: false, hasMore: false };
    }

    return {
        options: LONG_OPTIONS.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
        isLoading: false,
        hasMore: false,
    };
};

/** Long checklist: the list scrolls and the last checkbox stays clickable. */
export const LongList: TStory = {
    args: {
        useSuggest: useLongCitySuggest,
        placeholder: 'Search cities',
    },
};
