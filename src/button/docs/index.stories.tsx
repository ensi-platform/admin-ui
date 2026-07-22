import { Button } from '../index.js';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Button',
    component: Button,
    args: {
        children: 'Save',
        size: 'md',
        variant: 'primary',
        disabled: false,
    },
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
        },
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'tertiary'],
        },
    },
} satisfies Meta<typeof Button>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Secondary: TStory = {
    args: {
        variant: 'secondary',
    },
};

export const Disabled: TStory = {
    args: {
        disabled: true,
    },
};
