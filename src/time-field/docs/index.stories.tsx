import { useState } from 'react';

import { Time } from '@internationalized/date';
import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { type TimeValue } from 'react-aria-components';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';

import { FormTimeField } from '../FormTimeField';
import { type ITimeFieldProps } from '../types';

import Description from './Description.md';

import { TimeFieldStoryComponent } from '.';

const DEFAULT_ARGS: ITimeFieldProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    clear: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ITimeFieldProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clear: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: ITimeFieldProps) => {
    const [value, setValue] = useState<TimeValue | null>(new Time(14, 30));

    return (
        <div style={{ maxWidth: 240 }}>
            <TimeFieldStoryComponent aria-label="Время" {...args} value={value} onChange={setValue} />
        </div>
    );
};

export default {
    title: 'Form/DateField/TimeField',
    component: TimeFieldStoryComponent,
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
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof TimeFieldStoryComponent>;

export const Default: StoryObj<ITimeFieldProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ time: new Time(9, 0) }}
            validationSchema={z.object({
                time: z.any().refine(v => v != null, 'Обязательное поле'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 240 }}>
                <FormTimeField name="time" label="Время" clear />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};
