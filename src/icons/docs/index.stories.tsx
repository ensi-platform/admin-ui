import { type ComponentType, type SVGProps } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';

import { typographyStyles } from '@ds/typography';

import * as icons from '@/icons';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TIcon = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

const ICON_ENTRIES = Object.entries(icons) as [string, TIcon][];

export default {
    title: 'Design System/Icons',
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        controls: {
            disable: true,
        },
    },
} satisfies Meta;

export const All: StoryObj = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {ICON_ENTRIES.map(([name, Icon]) => (
                <div
                    key={name}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        width: 96,
                    }}
                >
                    <Icon width={20} height={20} />
                    <span className={typographyStyles.bodyXs}>{name}</span>
                </div>
            ))}
        </div>
    ),
};
