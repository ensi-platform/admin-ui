import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormMask } from '../FormMask';
import { type IMaskProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { MaskStoryComponent } from '.';

const PHONE_OPTS = { mask: '+7 (000) 000-00-00' };

const DEFAULT_ARGS: IMaskProps = {
    opts: PHONE_OPTS,
    size: 'md',
    placeholder: 'Phone',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IMaskProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
    opts: { control: false },
};

export default {
    title: 'Form/Mask',
    component: MaskStoryComponent,
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
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof MaskStoryComponent>;

export const Default: StoryObj<IMaskProps> = {
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <MaskStoryComponent aria-label="Phone" {...args} />
        </div>
    ),
};

export const Clear: StoryObj<IMaskProps> = {
    args: {
        clear: true,
        defaultValue: '+7 (999) 123-45-67',
    },
    render: Default.render,
};

export const Disabled: StoryObj<IMaskProps> = {
    args: {
        disabled: true,
        defaultValue: '+7 (999) 123-45-67',
    },
    render: Default.render,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form initialValues={{ phone: '' }} onSubmit={() => undefined}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormMask name="phone" label="Phone" hint="Include the country code" opts={PHONE_OPTS} clear />
                <Button type="submit">Save</Button>
            </div>
        </Form>
    ),
};
