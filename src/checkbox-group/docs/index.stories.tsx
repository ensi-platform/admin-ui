import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { Checkbox } from '@/checkbox';
import { Form } from '@/form';

import { FormCheckboxGroup } from '../FormCheckboxGroup';
import { type ICheckboxGroupProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { CheckboxGroupStoryComponent } from '.';

const DEFAULT_ARGS: Partial<ICheckboxGroupProps> = {
    size: 'md',
    disabled: false,
    invalid: false,
    defaultValue: ['a'],
    'aria-label': 'Tags',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ICheckboxGroupProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
};

const renderGroup = (args: ICheckboxGroupProps) => (
    <CheckboxGroupStoryComponent {...args}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
            <Checkbox value="c">C</Checkbox>
        </div>
    </CheckboxGroupStoryComponent>
);

export default {
    title: 'Form/CheckboxGroup',
    component: CheckboxGroupStoryComponent,
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
} satisfies Meta<typeof CheckboxGroupStoryComponent>;

export const Default: StoryObj<ICheckboxGroupProps> = {
    render: renderGroup,
};

export const Disabled: StoryObj<ICheckboxGroupProps> = {
    args: { disabled: true },
    render: renderGroup,
};

export const Invalid: StoryObj<ICheckboxGroupProps> = {
    args: { invalid: true },
    render: renderGroup,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form initialValues={{ tags: [] as string[] }} onSubmit={() => undefined}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormCheckboxGroup name="tags" label="Tags" hint="Multiple allowed">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Checkbox value="news">News</Checkbox>
                        <Checkbox value="promo">Promotions</Checkbox>
                    </div>
                </FormCheckboxGroup>
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};
