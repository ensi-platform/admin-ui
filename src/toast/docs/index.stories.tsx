import { type ReactNode } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';

import { Button } from '@/button';

import { DEFAULT_MAX_VISIBLE_TOASTS, DEFAULT_TIMEOUT } from '../constants';
import { ToastRegion, ToastProvider, useToast } from '../index';
import { type IToastAddOptions, type IToastContent, type TToastVariant } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

const VARIANTS: TToastVariant[] = ['neutral', 'success', 'warning', 'danger', 'info'];

interface IToastStoryArgs {
    title: string;
    description: string;
    timeout: number;
    variant: TToastVariant;
    maxVisibleToasts: number;
    defaultTimeout: number;
}

interface IOnCloseStoryArgs extends IToastStoryArgs {
    onClose: ReturnType<typeof fn>;
}

const DEFAULT_ARGS: IToastStoryArgs = {
    title: 'Saved',
    description: '',
    timeout: DEFAULT_TIMEOUT,
    variant: 'neutral',
    maxVisibleToasts: DEFAULT_MAX_VISIBLE_TOASTS,
    defaultTimeout: DEFAULT_TIMEOUT,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IToastStoryArgs>> = {
    title: {
        control: { type: 'text' },
        type: { name: 'string', required: true },
        description: 'Primary message.',
    },
    description: {
        control: { type: 'text' },
        description: 'Secondary message under the title.',
    },
    timeout: {
        control: { type: 'number' },
        description: 'Per-call auto-dismiss delay in ms. Overrides Provider `defaultTimeout`. Pass `0` to disable.',
        table: {
            defaultValue: { summary: String(DEFAULT_TIMEOUT) },
        },
    },
    variant: {
        control: { type: 'select' },
        options: VARIANTS,
        description: 'Semantic status variant.',
        table: {
            defaultValue: { summary: 'neutral' },
        },
    },
    maxVisibleToasts: {
        control: false,
        description: 'Max simultaneously visible toasts on ToastProvider. Fixed at mount.',
        table: {
            defaultValue: { summary: String(DEFAULT_MAX_VISIBLE_TOASTS) },
        },
    },
    defaultTimeout: {
        control: { type: 'number' },
        description: 'Provider default auto-dismiss delay in ms. Pass `0` for sticky by default.',
        table: {
            defaultValue: { summary: String(DEFAULT_TIMEOUT) },
        },
    },
};

const AppendToastButton = ({
    children,
    content,
    options,
}: {
    children: ReactNode;
    content: IToastContent;
    options?: IToastAddOptions;
}) => {
    const { appendToast } = useToast();

    return <Button onClick={() => appendToast(content, options)}>{children}</Button>;
};

const ToastDemoShell = ({
    children,
    maxVisibleToasts,
    defaultTimeout,
}: {
    children: ReactNode;
    maxVisibleToasts?: number;
    defaultTimeout?: number;
}) => (
    <ToastProvider maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
        <ToastRegion />
    </ToastProvider>
);

export default {
    title: 'Overlays/Toast',
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
} satisfies Meta<IToastStoryArgs>;

export const Default: StoryObj<IToastStoryArgs> = {
    render: ({ title, description, timeout, variant, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <AppendToastButton
                content={{ title, description: description || undefined, variant }}
                options={{ timeout }}
            >
                Show toast
            </AppendToastButton>
        </ToastDemoShell>
    ),
};

export const Variants: StoryObj<IToastStoryArgs> = {
    argTypes: {
        title: { control: false },
        variant: { control: false },
    },
    render: ({ description, timeout, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            {VARIANTS.map(item => (
                <AppendToastButton
                    key={item}
                    content={{
                        title: `Variant: ${item}`,
                        description: description || undefined,
                        variant: item,
                    }}
                    options={{ timeout }}
                >
                    {item}
                </AppendToastButton>
            ))}
        </ToastDemoShell>
    ),
};

export const WithDescription: StoryObj<IToastStoryArgs> = {
    args: {
        title: 'Could not save',
        description: 'Check your connection and try again.',
        variant: 'danger',
    },
    render: ({ title, description, timeout, variant, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <AppendToastButton
                content={{ title, description: description || undefined, variant }}
                options={{ timeout }}
            >
                Toast with description
            </AppendToastButton>
        </ToastDemoShell>
    ),
};

export const CustomTimeout: StoryObj<IToastStoryArgs> = {
    argTypes: {
        title: { control: false },
        timeout: { control: false },
        defaultTimeout: { control: false },
    },
    render: ({ description, variant, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <AppendToastButton
                content={{
                    title: 'Dismisses in 8s',
                    description: description || undefined,
                    variant,
                }}
                options={{ timeout: 8000 }}
            >
                timeout: 8000
            </AppendToastButton>
            <AppendToastButton
                content={{
                    title: 'Uses defaultTimeout (5s)',
                    description: description || undefined,
                    variant,
                }}
            >
                defaultTimeout
            </AppendToastButton>
        </ToastDemoShell>
    ),
};

export const OnClose: StoryObj<IOnCloseStoryArgs> = {
    args: {
        onClose: fn(),
    },
    argTypes: {
        title: { control: false },
        timeout: { control: false },
        onClose: { control: false },
    },
    render: ({ onClose, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <AppendToastButton
                content={{
                    title: 'Close me',
                    description: 'onClose is logged in Actions',
                    variant: 'info',
                }}
                options={{ timeout: 0, onClose }}
            >
                Show toast
            </AppendToastButton>
        </ToastDemoShell>
    ),
};
