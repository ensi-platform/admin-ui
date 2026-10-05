import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { FormDateRangePicker } from '@/date-range-picker';
import { Form } from '@/form';
import { GridLayout } from '@/grid-layout';
import { FormInput } from '@/input';

import { Filters } from '../Component';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

const FiltersDemo = () => (
    <Form initialValues={{ name: '', date: null }} onSubmit={() => undefined}>
        <Filters>
            <Filters.Body>
                <GridLayout cols={4} gap={16}>
                    <GridLayout.Item>
                        <FormInput name="name" label="Name" />
                    </GridLayout.Item>
                    <GridLayout.Item col={2}>
                        <FormDateRangePicker name="date" label="Date" />
                    </GridLayout.Item>
                </GridLayout>
            </Filters.Body>
            <Filters.Footer>
                <Button type="button">Filter settings</Button>
                <span>
                    <Button type="reset">Reset</Button> <Button type="submit">Apply</Button>
                </span>
            </Filters.Footer>
        </Filters>
    </Form>
);

FiltersDemo.displayName = 'Filters';

export default {
    title: 'Form/Filters',
    component: FiltersDemo,
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
    },
} satisfies Meta<typeof FiltersDemo>;

export const Default: StoryObj<typeof FiltersDemo> = {};
