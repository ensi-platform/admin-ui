import { type Meta, type StoryObj } from '@storybook/react';

import { AdminUiProvider, useAuiLabels, useAuiLocale } from '@/provider';

import { type IAdminUiProviderProps } from '../types';

import Description from './Description.md';

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

export default {
    title: 'Provider',
    component: ProviderStory,
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
    args: {
        locale: 'ru-RU',
        direction: 'ltr',
        labels: {
            close: 'Закрыть',
            clear: 'Очистить',
        },
    },
} satisfies Meta<typeof ProviderStory>;

export const Default: StoryObj<IAdminUiProviderProps> = {};

export const EnglishDefaults: StoryObj<IAdminUiProviderProps> = {
    args: {
        locale: 'en-US',
        labels: undefined,
    },
};
