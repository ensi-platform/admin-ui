import { type Meta, type StoryObj } from '@storybook/react';

import { typographyStyles } from '..';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';

const SAMPLE = 'Съешь ещё этих мягких французских булок, да выпей же чаю. 0123456789 — Inter.';

export default {
    title: 'Typography',
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        controls: {
            expanded: true,
        },
    },
} satisfies Meta;

export const Roles: StoryObj = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className={typographyStyles.bodyXs}>bodyXs — {SAMPLE}</p>
            <p className={typographyStyles.bodyS}>bodyS — {SAMPLE}</p>
            <p className={typographyStyles.bodyM}>bodyM — {SAMPLE}</p>
            <p className={typographyStyles.bodyL}>bodyL — {SAMPLE}</p>
        </div>
    ),
};

export const Weights: StoryObj = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className={typographyStyles.bodyM} style={{ fontWeight: 'var(--aui-font-weight-regular)' }}>
                Regular 400 — {SAMPLE}
            </p>
            <p className={typographyStyles.bodyM} style={{ fontWeight: 'var(--aui-font-weight-medium)' }}>
                Medium 500 — {SAMPLE}
            </p>
            <p className={typographyStyles.bodyM} style={{ fontWeight: 'var(--aui-font-weight-semibold)' }}>
                Semibold 600 — {SAMPLE}
            </p>
        </div>
    ),
};
