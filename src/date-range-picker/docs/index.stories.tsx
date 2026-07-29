import { useState } from 'react';

import { CalendarDate } from '@internationalized/date';
import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { type DateRange } from 'react-aria-components';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormDateRangePicker } from '../FormDateRangePicker';
import { type IDateRangePickerProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { docsCssVariables } from './cssVariables';

import { DateRangePickerStoryComponent } from '.';

const DEFAULT_ARGS: IDateRangePickerProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IDateRangePickerProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: IDateRangePickerProps) => {
    const [value, setValue] = useState<DateRange | null>({
        start: new CalendarDate(2024, 6, 1),
        end: new CalendarDate(2024, 6, 15),
    });

    return (
        <div style={{ maxWidth: 420 }}>
            <DateRangePickerStoryComponent aria-label="Period" {...args} value={value} onChange={setValue} />
        </div>
    );
};

export default {
    title: 'Form/DateField/DateRangePicker',
    component: DateRangePickerStoryComponent,
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
} satisfies Meta<typeof DateRangePickerStoryComponent>;

export const Default: StoryObj<IDateRangePickerProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{
                period: {
                    start: new CalendarDate(2024, 6, 1),
                    end: new CalendarDate(2024, 6, 15),
                },
            }}
            validationSchema={z.object({
                period: z.any().refine(v => v?.start && v?.end, 'Required field'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
                <FormDateRangePicker name="period" label="Period" clear />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    ),
};
