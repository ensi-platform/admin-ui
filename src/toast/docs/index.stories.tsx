import { type ReactNode } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { ToastRegion, ToastProvider, useToast } from '../index';
import { type IToastAddOptions, type IToastContent, type TToastVariant } from '../types';

import Description from './Description.md';

const VARIANTS: TToastVariant[] = ['neutral', 'success', 'warning', 'danger', 'info'];

interface IToastStoryArgs {
    title: string;
    description: string;
    timeout: number;
    variant: TToastVariant;
    maxVisibleToasts: number;
    defaultTimeout: number;
}

const DEFAULT_ARGS: IToastStoryArgs = {
    title: 'Сохранено',
    description: '',
    timeout: 5000,
    variant: 'neutral',
    maxVisibleToasts: 5,
    defaultTimeout: 5000,
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
    },
    variant: {
        control: { type: 'select' },
        options: VARIANTS,
        description: 'Semantic status variant. Defaults to `neutral`.',
    },
    maxVisibleToasts: {
        control: { type: 'number', min: 1 },
        description: 'Max simultaneously visible toasts on ToastProvider. Defaults to `5`. Fixed at mount.',
    },
    defaultTimeout: {
        control: { type: 'number' },
        description: 'Provider default auto-dismiss delay in ms. Defaults to `5000`. Pass `0` for sticky by default.',
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
    title: 'Toast',
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
} satisfies Meta<IToastStoryArgs>;

export const Default: StoryObj<IToastStoryArgs> = {
    render: ({ title, description, timeout, variant, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <AppendToastButton
                content={{ title, description: description || undefined, variant }}
                options={{ timeout }}
            >
                Показать toast
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
        title: 'Не удалось сохранить',
        description: 'Проверьте соединение и повторите попытку.',
        variant: 'danger',
    },
    render: ({ title, description, timeout, variant, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <AppendToastButton
                content={{ title, description: description || undefined, variant }}
                options={{ timeout }}
            >
                Toast с description
            </AppendToastButton>
        </ToastDemoShell>
    ),
};

export const CustomTimeout: StoryObj<IToastStoryArgs> = {
    args: {
        title: 'Исчезнет через 8 с',
    },
    argTypes: {
        timeout: { control: false },
    },
    render: ({ title, description, variant, maxVisibleToasts, defaultTimeout }) => (
        <ToastDemoShell maxVisibleToasts={maxVisibleToasts} defaultTimeout={defaultTimeout}>
            <AppendToastButton
                content={{ title, description: description || undefined, variant }}
                options={{ timeout: 8000 }}
            >
                timeout: 8000
            </AppendToastButton>
            <AppendToastButton content={{ title, description: description || undefined, variant }}>
                defaultTimeout
            </AppendToastButton>
        </ToastDemoShell>
    ),
};
