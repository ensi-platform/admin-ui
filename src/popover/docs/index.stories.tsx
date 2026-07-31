import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { Popover } from '../Component';
import { type IPopoverContentProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { PopoverStoryComponent, type TPopoverStoryProps } from '.';

const DEFAULT_ARGS: TPopoverStoryProps = {
    children: 'Popover content',
    size: 'md',
    variant: 'primary',
    arrow: false,
    placement: 'bottom',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TPopoverStoryProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    arrow: { control: { type: 'boolean' } },
    placement: { control: { type: 'select' } },
};

export default {
    title: 'Overlays/Popover',
    component: PopoverStoryComponent,
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
} satisfies Meta<typeof PopoverStoryComponent>;

export const Default: StoryObj<TPopoverStoryProps> = {};

export const WithArrow: StoryObj<TPopoverStoryProps> = {
    args: {
        arrow: true,
    },
};

export const WithActions: StoryObj<IPopoverContentProps> = {
    render: () => (
        <div style={{ padding: 48 }}>
            <Popover>
                <Popover.Trigger>
                    <Button>Filters</Button>
                </Popover.Trigger>
                <Popover.Content arrow>
                    <p style={{ margin: '0 0 12px' }}>Select order status</p>
                    <Button size="sm">Apply</Button>
                </Popover.Content>
            </Popover>
        </div>
    ),
};

export const Sizes: StoryObj<IPopoverContentProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 24, padding: 48 }}>
            <Popover>
                <Popover.Trigger>
                    <Button>sm</Button>
                </Popover.Trigger>
                <Popover.Content size="sm" arrow>
                    Size sm
                </Popover.Content>
            </Popover>
            <Popover>
                <Popover.Trigger>
                    <Button>md</Button>
                </Popover.Trigger>
                <Popover.Content size="md" arrow>
                    Size md
                </Popover.Content>
            </Popover>
            <Popover>
                <Popover.Trigger>
                    <Button>lg</Button>
                </Popover.Trigger>
                <Popover.Content size="lg" arrow>
                    Size lg
                </Popover.Content>
            </Popover>
        </div>
    ),
};
