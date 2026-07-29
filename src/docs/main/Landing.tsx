import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { Button } from '@/button';

import styles from './styles.module.css';

interface ILandingCopy {
    title: string;
    lede: string;
    ctaStart: string;
    cards: { title: string; description: string; href: string }[];
}

const COPY: Record<'ru' | 'en', ILandingCopy> = {
    ru: {
        title: 'Документация Admin UI',
        lede: 'UI для админ-панели Ensi: кнопки, поля форм, оверлеи и таблица. Стили на токенах `--aui-*`, поведение — React Aria.',
        ctaStart: 'С чего начать',
        cards: [
            {
                title: 'Base',
                description: 'Button, Badge, Tag, Tabs, Table, Loader',
                href: '/?path=/docs/base-button--docs',
            },
            {
                title: 'Form',
                description: 'Field, Input, Select, Checkbox, DateField и Form',
                href: '/?path=/docs/form-input--docs',
            },
            {
                title: 'Overlays',
                description: 'Modal, Drawer, Popover, Tooltip, ModalHub',
                href: '/?path=/docs/overlays-modal--docs',
            },
            {
                title: 'Design System',
                description: 'Provider, Typography',
                href: '/?path=/docs/design-system-provider--docs',
            },
        ],
    },
    en: {
        title: 'Admin UI docs',
        lede: 'UI library for the Ensi admin panel: buttons, form fields, overlays, and table. Styles use `--aui-*` tokens; behavior comes from React Aria.',
        ctaStart: 'Getting started',
        cards: [
            {
                title: 'Base',
                description: 'Button, Badge, Tag, Tabs, Table, Loader',
                href: '/?path=/docs/base-button--docs',
            },
            {
                title: 'Form',
                description: 'Field, Input, Select, Checkbox, DateField, and Form',
                href: '/?path=/docs/form-input--docs',
            },
            {
                title: 'Overlays',
                description: 'Modal, Drawer, Popover, Tooltip, ModalHub',
                href: '/?path=/docs/overlays-modal--docs',
            },
            {
                title: 'Design System',
                description: 'Provider, Typography',
                href: '/?path=/docs/design-system-provider--docs',
            },
        ],
    },
};

interface ILandingProps {
    /** BCP 47 locale from Storybook toolbar. */
    locale?: string;
}

/** Storybook root landing (Kontur-style Main). */
export const Landing = ({ locale = 'ru-RU' }: ILandingProps) => {
    const localeKey = locale.startsWith('ru') ? 'ru' : 'en';
    const copy = COPY[localeKey];

    return (
        <div className={styles.root}>
            <h1 className={cn(typographyStyles.bodyL, styles.title)}>{copy.title}</h1>
            <p className={cn(typographyStyles.bodyM, styles.lede)}>{copy.lede}</p>
            <div className={styles.cta}>
                <Button as="a" href="/?path=/docs/getting-started--docs" target="_top" variant="primary" size="lg">
                    {copy.ctaStart}
                </Button>
            </div>
            <div className={styles.cards}>
                {copy.cards.map(card => (
                    <a key={card.title} href={card.href} target="_top" className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={cn(typographyStyles.bodyM, styles.cardTitle)}>{card.title}</div>
                            <span className={styles.cardArrow} aria-hidden>
                                →
                            </span>
                        </div>
                        <p className={cn(typographyStyles.bodyS, styles.cardDescription)}>{card.description}</p>
                    </a>
                ))}
            </div>
        </div>
    );
};
