import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '../../button/index.js';
import { Checkbox } from '../../checkbox/index.js';
import { Form } from '../../form/index.js';
import { FormCheckboxGroup } from '../FormCheckboxGroup.js';

import Description from './Description.md';

import { CheckboxGroupStoryComponent } from './index.js';

export default {
    title: 'CheckboxGroup',
    component: CheckboxGroupStoryComponent,
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
} satisfies Meta<typeof CheckboxGroupStoryComponent>;

export const Default: StoryObj = {
    render: () => (
        <CheckboxGroupStoryComponent defaultValue={['a']} aria-label="Теги">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
                <Checkbox value="c">C</Checkbox>
            </div>
        </CheckboxGroupStoryComponent>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form initialValues={{ tags: [] as string[] }} onSubmit={() => undefined}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
                <FormCheckboxGroup name="tags" label="Теги" hint="Можно несколько">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Checkbox value="news">Новости</Checkbox>
                        <Checkbox value="promo">Акции</Checkbox>
                    </div>
                </FormCheckboxGroup>
                <Button type="submit">Отправить</Button>
            </div>
        </Form>
    ),
};
