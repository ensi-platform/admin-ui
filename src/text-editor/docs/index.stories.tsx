import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormTextEditor } from '../FormTextEditor';
import { type ITextEditorProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { TextEditorStoryComponent } from '.';

const DEFAULT_ARGS: ITextEditorProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    readOnly: false,
    defaultValue: '<p>Page text</p>',
    'aria-label': 'Page text',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ITextEditorProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
};

export default {
    title: 'Alpha/TextEditor',
    component: TextEditorStoryComponent,
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
} satisfies Meta<typeof TextEditorStoryComponent>;

export const Default: StoryObj<ITextEditorProps> = {
    render: args => (
        <div style={{ maxWidth: 640 }}>
            <TextEditorStoryComponent {...args} />
        </div>
    ),
};

export const Sizes: StoryObj<ITextEditorProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
            <TextEditorStoryComponent aria-label="Small" size="sm" defaultValue="<p>Small</p>" />
            <TextEditorStoryComponent aria-label="Medium" size="md" defaultValue="<p>Medium</p>" />
            <TextEditorStoryComponent aria-label="Large" size="lg" defaultValue="<p>Large</p>" />
        </div>
    ),
};

export const Disabled: StoryObj<ITextEditorProps> = {
    args: { disabled: true },
    render: Default.render,
};

export const Invalid: StoryObj<ITextEditorProps> = {
    args: { invalid: true },
    render: Default.render,
};

export const ForeignHtml: StoryObj<ITextEditorProps> = {
    args: {
        defaultValue: '<p>Intro</p><div class="banner">Banner markup</div>',
    },
    render: Default.render,
};

export const ScriptChip: StoryObj<ITextEditorProps> = {
    args: {
        defaultValue: '<script>alert(1)</script>',
    },
    render: Default.render,
};

export const Video: StoryObj<ITextEditorProps> = {
    args: {
        defaultValue: '<p>Clip</p><iframe src="https://ensi.tech"></iframe>',
    },
    render: Default.render,
};

export const Limited: StoryObj<ITextEditorProps> = {
    args: {
        defaultValue: '<p>Hi</p>',
        maxLength: 20,
    },
    render: Default.render,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form initialValues={{ content: '<p>Hello</p>' }} onSubmit={() => undefined}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
                <FormTextEditor name="content" label="Text" hint="Headings, lists, and links" />
                <Button type="submit">Save</Button>
            </div>
        </Form>
    ),
};
