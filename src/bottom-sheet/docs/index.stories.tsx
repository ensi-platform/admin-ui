import { useState, type ReactNode } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { BottomSheet } from '../Component';
import { type TBottomSheetCloseButtonSize } from '../components/CloseButton/types';
import { type IBottomSheetProps } from '../types';

import Description from './Description.md';

import { BottomSheetStoryComponent } from '.';

const DEFAULT_ARGS: Partial<IBottomSheetProps> = {
    variant: 'primary',
    fullscreen: false,
    dismissable: true,
    keyboardDismissable: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IBottomSheetProps>> = {
    variant: { control: { type: 'select' } },
    fullscreen: { control: { type: 'boolean' } },
    dismissable: { control: { type: 'boolean' } },
    keyboardDismissable: { control: { type: 'boolean' } },
};

const BottomSheetDemo = ({
    triggerLabel,
    body,
    closeButtonSize,
    ...props
}: Omit<IBottomSheetProps, 'open' | 'onOpenChange' | 'children'> & {
    triggerLabel?: string;
    body?: ReactNode;
    closeButtonSize?: TBottomSheetCloseButtonSize;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{triggerLabel ?? 'Открыть BottomSheet'}</Button>
            <BottomSheet {...props} open={open} onOpenChange={setOpen}>
                <BottomSheet.Header>
                    <BottomSheet.Title>Заголовок</BottomSheet.Title>
                    <BottomSheet.CloseButton size={closeButtonSize} />
                </BottomSheet.Header>
                <BottomSheet.Body>{body ?? 'Контент шторки. Свайп вниз закрывает.'}</BottomSheet.Body>
                <BottomSheet.Footer>
                    <Button onClick={() => setOpen(false)}>Закрыть</Button>
                </BottomSheet.Footer>
            </BottomSheet>
        </>
    );
};

export default {
    title: 'BottomSheet',
    component: BottomSheetStoryComponent,
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
} satisfies Meta<typeof BottomSheetStoryComponent>;

export const Default: StoryObj<IBottomSheetProps> = {
    render: args => <BottomSheetDemo {...args} />,
};

export const CloseButtonSizes: StoryObj<IBottomSheetProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <BottomSheetDemo closeButtonSize="sm" triggerLabel="CloseButton sm" />
            <BottomSheetDemo closeButtonSize="md" triggerLabel="CloseButton md" />
            <BottomSheetDemo closeButtonSize="lg" triggerLabel="CloseButton lg" />
        </div>
    ),
};

export const Fullscreen: StoryObj<IBottomSheetProps> = {
    render: () => <BottomSheetDemo fullscreen />,
};

export const LongContent: StoryObj<IBottomSheetProps> = {
    render: () => (
        <BottomSheetDemo
            body={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Array.from({ length: 30 }, (_, index) => (
                        <p key={index} style={{ margin: 0 }}>
                            Строка контента {index + 1}. Скролл внутри Body; свайп вниз закрывает только у верха
                            скролла.
                        </p>
                    ))}
                </div>
            }
        />
    ),
};
