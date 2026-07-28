import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { type ILoaderBaseProps } from '../types';

import Description from './Description.md';

import { LoaderStoryComponent } from '.';

const DEFAULT_ARGS: ILoaderBaseProps = {
    children: null,
    size: 'md',
    active: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ILoaderBaseProps>> = {
    size: { control: { type: 'select' } },
    active: { control: { type: 'boolean' } },
};

export default {
    title: 'Loader',
    component: LoaderStoryComponent,
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
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof LoaderStoryComponent>;

export const Default: StoryObj<ILoaderBaseProps> = {
    render: function DefaultStory(args) {
        const [active, setActive] = useState(args.active ?? true);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button size="sm" variant="secondary" onClick={() => setActive(v => !v)}>
                    {active ? 'Hide loader' : 'Show loader'}
                </Button>
                <LoaderStoryComponent {...args} active={active}>
                    <div
                        style={{
                            minHeight: 160,
                            padding: 16,
                            border: '1px solid var(--aui-surface-border-primary)',
                            borderRadius: 8,
                            background: 'var(--aui-surface-bg-primary)',
                        }}
                    >
                        <p style={{ margin: 0 }}>List content stays mounted under the veil.</p>
                        <button type="button" style={{ marginTop: 12 }}>
                            Try click (blocked while active)
                        </button>
                    </div>
                </LoaderStoryComponent>
            </div>
        );
    },
};
