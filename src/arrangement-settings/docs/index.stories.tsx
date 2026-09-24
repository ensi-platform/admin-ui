import { useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';

import { ArrangementSettings } from '../Component';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

const items = [
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
    { id: 'date', label: 'Date' },
];

const ArrangementSettingsDemo = () => {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(['name', 'date']);

    return (
        <>
            <Button type="button" onClick={() => setOpen(true)}>
                Columns
            </Button>
            <ArrangementSettings
                open={open}
                onOpenChange={setOpen}
                title="Columns"
                items={items}
                value={visible}
                onSave={setVisible}
            />
        </>
    );
};

ArrangementSettingsDemo.displayName = 'ArrangementSettings';

export default {
    title: 'Form/ArrangementSettings',
    component: ArrangementSettingsDemo,
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
} satisfies Meta<typeof ArrangementSettingsDemo>;

export const Default: StoryObj<typeof ArrangementSettingsDemo> = {};
