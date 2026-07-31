import { useState, type ReactNode } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { BottomSheet } from '../Component';
import { type IBottomSheetProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

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
    ...props
}: Omit<IBottomSheetProps, 'open' | 'onOpenChange' | 'children'> & {
    triggerLabel?: string;
    body?: ReactNode;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{triggerLabel ?? 'Open BottomSheet'}</Button>
            <BottomSheet {...props} open={open} onOpenChange={setOpen}>
                <BottomSheet.Header>
                    <BottomSheet.Title>Title</BottomSheet.Title>
                    <BottomSheet.CloseButton />
                </BottomSheet.Header>
                <BottomSheet.Body>{body ?? 'Sheet content. Swipe down to dismiss.'}</BottomSheet.Body>
                <BottomSheet.Footer>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </BottomSheet.Footer>
            </BottomSheet>
        </>
    );
};

export default {
    title: 'Overlays/BottomSheet',
    component: BottomSheetStoryComponent,
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
} satisfies Meta<typeof BottomSheetStoryComponent>;

export const Default: StoryObj<IBottomSheetProps> = {
    render: args => <BottomSheetDemo {...args} />,
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
                            Content row {index + 1}. Scroll inside Body; swipe down dismisses only at the top of the
                            scroll.
                        </p>
                    ))}
                </div>
            }
        />
    ),
};
