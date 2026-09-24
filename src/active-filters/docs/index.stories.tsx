import { useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';

import { Checkbox } from '@/checkbox';

import { ActiveFilters } from '..';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

const OPTIONS = [
    'Meat',
    'Fish',
    'Dairy',
    'Bakery',
    'Produce',
    'Frozen',
    'Drinks',
    'Snacks',
    'Canned',
    'Spices',
    'Oils',
    'Grains',
].map(label => ({ id: label.toLowerCase(), label }));

const ActiveFiltersDemo = () => {
    const [nameOn, setNameOn] = useState(true);
    const [selected, setSelected] = useState(['meat', 'fish', 'dairy']);

    return (
        <ActiveFilters
            onClear={() => {
                setNameOn(false);
                setSelected([]);
            }}
        >
            {nameOn ? <ActiveFilters.Item onRemove={() => setNameOn(false)}>Name: milk</ActiveFilters.Item> : null}
            {selected.length > 1 ? (
                <ActiveFilters.Group label="Categories" count={selected.length} onRemove={() => setSelected([])}>
                    {OPTIONS.map(option => (
                        <Checkbox
                            key={option.id}
                            checked={selected.includes(option.id)}
                            onChange={checked => {
                                setSelected(current =>
                                    checked ? [...current, option.id] : current.filter(id => id !== option.id)
                                );
                            }}
                        >
                            {option.label}
                        </Checkbox>
                    ))}
                </ActiveFilters.Group>
            ) : (
                selected.map(id => (
                    <ActiveFilters.Item
                        key={id}
                        onRemove={() => setSelected(current => current.filter(item => item !== id))}
                    >
                        Category: {OPTIONS.find(option => option.id === id)?.label}
                    </ActiveFilters.Item>
                ))
            )}
        </ActiveFilters>
    );
};

ActiveFiltersDemo.displayName = 'ActiveFilters';

export default {
    title: 'Base/ActiveFilters',
    component: ActiveFiltersDemo,
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
} satisfies Meta<typeof ActiveFiltersDemo>;

export const Default: StoryObj<typeof ActiveFiltersDemo> = {};
