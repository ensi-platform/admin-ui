import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '../../button/index.js';
import { Form } from '../../form/index.js';
import { FormNumberInput } from '../FormNumberInput.js';
import { kopecksTransform } from '../transforms.js';
import { type INumberInputProps } from '../types.js';

import Description from './Description.md';

import { NumberInputStoryComponent } from './index.js';

const DEFAULT_ARGS: INumberInputProps = {
    size: 'md',
    disabled: false,
    isInvalid: false,
    placeholder: '0',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<INumberInputProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    isInvalid: { control: { type: 'boolean' } },
};

const DefaultDemo = (args: INumberInputProps) => {
    const [value, setValue] = useState<number | null>(null);

    return (
        <div style={{ maxWidth: 320 }}>
            <NumberInputStoryComponent aria-label="Количество" {...args} value={value} onChange={setValue} />
        </div>
    );
};

const SuffixDemo = () => {
    const [value, setValue] = useState<number | null>(10.5);

    return (
        <div style={{ maxWidth: 320 }}>
            <NumberInputStoryComponent
                aria-label="Цена"
                value={value}
                onChange={setValue}
                suffix="₽"
                step={0.01}
                min={0}
            />
        </div>
    );
};

export default {
    title: 'Form/NumberInput',
    component: NumberInputStoryComponent,
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
} satisfies Meta<typeof NumberInputStoryComponent>;

export const Default: StoryObj<INumberInputProps> = {
    render: args => <DefaultDemo {...args} />,
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ qty: null as number | null, price: 1050 }}
            validationSchema={z.object({
                qty: z.number().min(1, 'Минимум 1'),
                price: z.number().min(0, 'Неотрицательная цена'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormNumberInput name="qty" label="Количество" />
                <FormNumberInput
                    name="price"
                    label="Цена"
                    hint="В форме хранятся копейки"
                    suffix="₽"
                    transform={kopecksTransform}
                    step={0.01}
                    min={0}
                />
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};

export const WithSuffix: StoryObj<INumberInputProps> = {
    render: () => <SuffixDemo />,
};

export const Disabled: StoryObj<INumberInputProps> = {
    args: {
        disabled: true,
        value: 42,
    },
    render: args => (
        <div style={{ maxWidth: 320 }}>
            <NumberInputStoryComponent aria-label="Qty" {...args} />
        </div>
    ),
};
