import { useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { type IActionPopupProps, type TConfirmModalProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

import { ActionPopupStoryComponent, ConfirmModalStoryComponent, DeleteModalStoryComponent } from '.';

const ConfirmDemo = (
    props: Omit<TConfirmModalProps, 'open' | 'onOpenChange' | 'onConfirm' | 'title'> & {
        title?: string;
        triggerLabel?: string;
    }
) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{props.triggerLabel ?? 'Open ConfirmModal'}</Button>
            <ConfirmModalStoryComponent
                {...props}
                open={open}
                onOpenChange={setOpen}
                title={props.title ?? 'Confirm action?'}
                onConfirm={() => undefined}
            >
                {props.children ?? 'Are you sure you want to continue?'}
            </ConfirmModalStoryComponent>
        </>
    );
};

const DeleteDemo = (
    props: Omit<TConfirmModalProps, 'open' | 'onOpenChange' | 'onConfirm' | 'title'> & {
        title?: string;
        triggerLabel?: string;
    }
) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="danger" onClick={() => setOpen(true)}>
                {props.triggerLabel ?? 'Open DeleteModal'}
            </Button>
            <DeleteModalStoryComponent
                {...props}
                open={open}
                onOpenChange={setOpen}
                title={props.title ?? 'Delete this record?'}
                onConfirm={() => undefined}
            >
                {props.children ?? 'This action cannot be undone.'}
            </DeleteModalStoryComponent>
        </>
    );
};

const ActionPopupDemo = (
    props: Omit<IActionPopupProps, 'open' | 'onOpenChange' | 'onConfirm'> & { triggerLabel?: string }
) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{props.triggerLabel ?? 'Open ActionPopup'}</Button>
            <ActionPopupStoryComponent {...props} open={open} onOpenChange={setOpen} onConfirm={() => undefined} />
        </>
    );
};

export default {
    title: 'Overlays/ActionPopup',
    component: ConfirmModalStoryComponent,
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
} satisfies Meta<typeof ConfirmModalStoryComponent>;

export const Confirm: StoryObj = {
    render: () => <ConfirmDemo />,
};

export const Delete: StoryObj = {
    render: () => <DeleteDemo />,
};

export const Custom: StoryObj = {
    render: () => (
        <ActionPopupDemo title="Unlink products?" tone="danger" confirmLabel="Unlink" cancelLabel="Keep linked">
            Items will be unlinked from the discount.
        </ActionPopupDemo>
    ),
};
