import { type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormPassword } from '../FormPassword';
import { type IPasswordProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { PasswordStoryComponent } from '.';

export default {
    title: 'Form/Password',
    component: PasswordStoryComponent,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        controls: {
            expanded: true,
        },
    },
} satisfies Meta<typeof PasswordStoryComponent>;

export const Default: StoryObj<IPasswordProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <PasswordStoryComponent aria-label="Password" placeholder="Password" />
        </div>
    ),
};

export const WithAddon: StoryObj<IPasswordProps> = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <PasswordStoryComponent aria-label="Password" rightAddon="copy" />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ password: '' }}
            validationSchema={z.object({ password: z.string().min(1, 'Required field') })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormPassword name="password" label="Password" />
                <Button type="submit">Save</Button>
            </div>
        </Form>
    ),
};
