import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { typographyStyles } from '@ds/typography';

import { AdminUiProvider, useAuiDirection, useAuiLabels, useAuiLocale } from '..';

import styles from '../styles.module.css';

const providerDir = dirname(fileURLToPath(import.meta.url));

const LabelsProbe = () => {
    const { clear } = useAuiLabels();

    return <span data-test-id="labels">{clear}</span>;
};

const LocaleProbe = () => {
    const locale = useAuiLocale();

    return <span data-test-id="locale">{locale}</span>;
};

const DirectionProbe = () => {
    const direction = useAuiDirection();

    return <span data-test-id="direction">{direction}</span>;
};

describe('AdminUiProvider', () => {
    it('exposes labels, locale and direction', () => {
        render(
            <AdminUiProvider locale="en-US" direction="rtl" labels={{ clear: 'Clear' }}>
                <LabelsProbe />
                <LocaleProbe />
                <DirectionProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('labels')).toHaveTextContent('Clear');
        expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
        expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    });

    it('paints page substrate on root', () => {
        render(
            <AdminUiProvider data-test-id="aui-root">
                <span>child</span>
            </AdminUiProvider>
        );

        const root = screen.getByTestId('aui-root');

        expect(root).toHaveClass(styles.root);
        expect(root).toHaveClass(typographyStyles.bodyM);

        const css = readFileSync(resolve(providerDir, '../styles.module.css'), 'utf8');

        expect(css).toMatch(/\.root\s*\{[^}]*background:\s*var\(--aui-page-bg-primary\)/s);
        expect(css).toMatch(/\.root\s*\{[^}]*color:\s*var\(--aui-page-fg-primary\)/s);
        expect(css).toMatch(/\.root\s*\{[^}]*min-height:\s*100%/s);
    });

    it('forwards callback ref to the root', () => {
        const ref = vi.fn();

        render(
            <AdminUiProvider ref={ref} data-test-id="aui-root">
                <span>child</span>
            </AdminUiProvider>
        );

        expect(ref).toHaveBeenCalledWith(screen.getByTestId('aui-root'));
    });

    it('forwards object ref to the root', () => {
        const ref = { current: null as HTMLDivElement | null };

        render(
            <AdminUiProvider ref={ref} data-test-id="aui-root">
                <span>child</span>
            </AdminUiProvider>
        );

        expect(ref.current).toBe(screen.getByTestId('aui-root'));
    });

    it('throws useAuiLabels outside provider', () => {
        expect(() => render(<LabelsProbe />)).toThrow(
            'AdminUiProvider is required. Wrap the app with <AdminUiProvider>.'
        );
    });
});
