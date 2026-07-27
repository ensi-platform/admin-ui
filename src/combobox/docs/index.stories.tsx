import { type Meta, type StoryObj } from '@storybook/react';

import Description from './Description.md';

import { ComboboxStoryComponent } from '.';

const meta = {
    title: 'Combobox',
    component: ComboboxStoryComponent,
    parameters: {
        docs: {
            description: {
                component: Description,
            },
        },
    },
} satisfies Meta<typeof ComboboxStoryComponent>;

export default meta;

type TStory = StoryObj<typeof ComboboxStoryComponent>;

export const EmptyStatus: TStory = {
    args: {
        isEmpty: true,
    },
};

export const LoadingStatus: TStory = {
    args: {
        isLoading: true,
    },
};

export const ErrorStatus: TStory = {
    args: {
        isError: true,
    },
};
