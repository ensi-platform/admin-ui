import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { Tooltip } from '../Component';
import { type ITooltipContentProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { TooltipStoryComponent, type TTooltipStoryProps } from '.';

const DEFAULT_ARGS: TTooltipStoryProps = {
    children: 'Short tip',
    size: 'md',
    variant: 'primary',
    arrow: false,
    delay: 200,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TTooltipStoryProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    arrow: { control: { type: 'boolean' } },
    delay: { control: { type: 'number' } },
};

export default {
    title: 'Overlays/Tooltip',
    component: TooltipStoryComponent,
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
} satisfies Meta<typeof TooltipStoryComponent>;

export const Default: StoryObj<TTooltipStoryProps> = {};

export const WithArrow: StoryObj<TTooltipStoryProps> = {
    args: {
        arrow: true,
    },
};

export const Sizes: StoryObj<ITooltipContentProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 24, padding: 48 }}>
            <Tooltip delay={0}>
                <Tooltip.Trigger>
                    <Button>sm</Button>
                </Tooltip.Trigger>
                <Tooltip.Content size="sm" arrow>
                    Size sm
                </Tooltip.Content>
            </Tooltip>
            <Tooltip delay={0}>
                <Tooltip.Trigger>
                    <Button>md</Button>
                </Tooltip.Trigger>
                <Tooltip.Content size="md" arrow>
                    Size md
                </Tooltip.Content>
            </Tooltip>
            <Tooltip delay={0}>
                <Tooltip.Trigger>
                    <Button>lg</Button>
                </Tooltip.Trigger>
                <Tooltip.Content size="lg" arrow>
                    Size lg
                </Tooltip.Content>
            </Tooltip>
        </div>
    ),
};
