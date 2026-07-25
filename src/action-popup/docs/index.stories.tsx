import { useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { type IActionPopupProps, type TConfirmModalProps } from '../types';

import Description from './Description.md';

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
            <Button onClick={() => setOpen(true)}>{props.triggerLabel ?? 'Открыть ConfirmModal'}</Button>
            <ConfirmModalStoryComponent
                {...props}
                open={open}
                onOpenChange={setOpen}
                title={props.title ?? 'Подтвердить действие?'}
                onConfirm={() => undefined}
            >
                {props.children ?? 'Вы уверены, что хотите продолжить?'}
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
                {props.triggerLabel ?? 'Открыть DeleteModal'}
            </Button>
            <DeleteModalStoryComponent
                {...props}
                open={open}
                onOpenChange={setOpen}
                title={props.title ?? 'Удалить запись?'}
                onConfirm={() => undefined}
            >
                {props.children ?? 'Действие необратимо.'}
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
            <Button onClick={() => setOpen(true)}>{props.triggerLabel ?? 'Открыть ActionPopup'}</Button>
            <ActionPopupStoryComponent {...props} open={open} onOpenChange={setOpen} onConfirm={() => undefined} />
        </>
    );
};

export default {
    title: 'ActionPopup',
    component: ConfirmModalStoryComponent,
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
} satisfies Meta<typeof ConfirmModalStoryComponent>;

export const Confirm: StoryObj = {
    render: () => <ConfirmDemo />,
};

export const Delete: StoryObj = {
    render: () => <DeleteDemo />,
};

export const CustomActionPopup: StoryObj = {
    render: () => (
        <ActionPopupDemo title="Отвязать товары?" tone="danger" confirmLabel="Отвязать" cancelLabel="Не отвязывать">
            Товары будут отвязаны от скидки.
        </ActionPopupDemo>
    ),
};
