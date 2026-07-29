import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { type ILoaderBaseProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

import { LoaderStoryComponent } from '.';

const DEFAULT_ARGS: ILoaderBaseProps = {
    size: 'md',
    active: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ILoaderBaseProps>> = {
    size: { control: { type: 'select' } },
    active: { control: { type: 'boolean' } },
};

const demoPanelStyle = {
    minHeight: 160,
    padding: 16,
    border: '1px solid var(--aui-surface-border-primary)',
    borderRadius: 8,
    background: 'var(--aui-surface-bg-primary)',
} as const;

export default {
    title: 'Base/Loader',
    component: LoaderStoryComponent,
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
} satisfies Meta<typeof LoaderStoryComponent>;

export const Default: StoryObj<ILoaderBaseProps> = {
    render: function DefaultStory(args) {
        const [active, setActive] = useState(args.active ?? true);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button size="sm" variant="secondary" onClick={() => setActive(v => !v)}>
                    {active ? 'Hide' : 'Show'}
                </Button>
                <LoaderStoryComponent {...args} active={active}>
                    <div style={demoPanelStyle}>
                        <p style={{ margin: 0 }}>List content stays under the veil.</p>
                        <button type="button" style={{ marginTop: 12 }}>
                            Click (blocked when active)
                        </button>
                    </div>
                </LoaderStoryComponent>
            </div>
        );
    },
};

export const Sizes: StoryObj<ILoaderBaseProps> = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {(['sm', 'md', 'lg'] as const).map(size => (
                <LoaderStoryComponent key={size} size={size} active>
                    <div style={{ ...demoPanelStyle, minHeight: 120, minWidth: 120 }}>{size}</div>
                </LoaderStoryComponent>
            ))}
        </div>
    ),
};
