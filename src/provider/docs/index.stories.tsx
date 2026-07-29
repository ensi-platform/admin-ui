import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { AdminUiProvider, useAuiLabels, useAuiLocale } from '@/provider';

import { type IAdminUiProviderProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

const LabelsPreview = () => {
    const locale = useAuiLocale();
    const { close, clear } = useAuiLabels();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>locale: {locale}</div>
            <div>close: {close}</div>
            <div>clear: {clear}</div>
        </div>
    );
};

const ProviderStory = (props: IAdminUiProviderProps) => (
    <AdminUiProvider {...props}>
        <LabelsPreview />
    </AdminUiProvider>
);

ProviderStory.displayName = 'AdminUiProvider';

const DEFAULT_ARGS: Partial<IAdminUiProviderProps> = {
    locale: 'ru-RU',
    direction: 'ltr',
    labels: {
        close: 'Close',
        clear: 'Clear',
    },
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IAdminUiProviderProps>> = {
    locale: { control: { type: 'text' } },
    direction: { control: { type: 'select' }, options: ['ltr', 'rtl'] },
};

export default {
    title: 'Design System/Provider',
    component: ProviderStory,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        controls: {
            expanded: true,
        },
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof ProviderStory>;

export const Default: StoryObj<IAdminUiProviderProps> = {};

export const EnglishDefaults: StoryObj<IAdminUiProviderProps> = {
    args: {
        locale: 'en-US',
        labels: undefined,
    },
};
