import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormNumberRange } from '../FormNumberRange';
import { type INumberRangeProps, type TNumberRangeSize } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { NumberRangeStoryComponent } from '.';

const DEFAULT_ARGS: INumberRangeProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    clear: false,
    fromLabel: 'From',
    toLabel: 'To',
    fromPlaceholder: 'From',
    toPlaceholder: 'To',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<INumberRangeProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: INumberRangeProps) => {
    const [value, setValue] = useState(args.value ?? { from: 10, to: 100 });

    return (
        <div style={{ maxWidth: 360 }}>
            <NumberRangeStoryComponent {...args} value={value} onChange={setValue} />
        </div>
    );
};

const SIZES: TNumberRangeSize[] = ['sm', 'md', 'lg'];

export default {
    title: 'Form/NumberRange',
    component: NumberRangeStoryComponent,
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
} satisfies Meta<typeof NumberRangeStoryComponent>;

export const Default: StoryObj<INumberRangeProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const Sizes: StoryObj<INumberRangeProps> = {
    render: args => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
            {SIZES.map(size => (
                <NumberRangeStoryComponent key={size} {...args} size={size} defaultValue={{ from: 10, to: 100 }} />
            ))}
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form initialValues={{ amount: { from: 10, to: 100 } }} onSubmit={() => undefined}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
                <FormNumberRange
                    name="amount"
                    label="Amount"
                    hint="Inclusive bounds"
                    fromLabel="From"
                    toLabel="To"
                    fromPlaceholder="From"
                    toPlaceholder="To"
                    clear
                    min={0}
                />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};

export const Disabled: StoryObj<INumberRangeProps> = {
    args: {
        disabled: true,
        value: { from: 10, to: 100 },
    },
    render: args => (
        <div style={{ maxWidth: 360 }}>
            <NumberRangeStoryComponent {...args} />
        </div>
    ),
};

export const Invalid: StoryObj<INumberRangeProps> = {
    args: {
        invalid: true,
        value: { from: 10, to: 100 },
    },
    render: args => (
        <div style={{ maxWidth: 360 }}>
            <NumberRangeStoryComponent {...args} />
        </div>
    ),
};
