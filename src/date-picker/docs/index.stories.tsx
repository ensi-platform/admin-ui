import { useState } from 'react';

import { type DateValue, parseDate, parseDateTime } from '@internationalized/date';
import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormDatePicker } from '../FormDatePicker';
import { type IDatePickerProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { DatePickerStoryComponent } from '.';

const DEFAULT_ARGS: IDatePickerProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IDatePickerProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: IDatePickerProps) => {
    const [value, setValue] = useState<DateValue | null>(parseDate('2024-06-15'));

    return (
        <div style={{ maxWidth: 320 }}>
            <DatePickerStoryComponent aria-label="Date" {...args} value={value} onChange={setValue} />
        </div>
    );
};

export default {
    title: 'Form/DateField/DatePicker',
    component: DatePickerStoryComponent,
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
} satisfies Meta<typeof DatePickerStoryComponent>;

export const Default: StoryObj<IDatePickerProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ date: parseDate('2024-06-15') }}
            validationSchema={z.object({
                date: z.any().refine(v => v != null, 'Required field'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormDatePicker name="date" label="Date" clear />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};

const WithTimeDemo = (args: IDatePickerProps) => {
    const [value, setValue] = useState<DateValue | null>(parseDateTime('2024-06-15T14:30'));

    return (
        <div style={{ maxWidth: 360 }}>
            <DatePickerStoryComponent
                aria-label="Date and time"
                granularity="minute"
                {...args}
                value={value}
                onChange={setValue}
                clear
            />
        </div>
    );
};

export const WithTime: StoryObj<IDatePickerProps> = {
    render: args => <WithTimeDemo {...args} />,
};
