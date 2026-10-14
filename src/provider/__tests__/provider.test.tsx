import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { type ComponentPropsWithRef } from 'react';

import { createRoot } from 'react-dom/client';

import { act, render, screen } from '@testing-library/react';
import { render as renderBare } from '@testing-library/react/pure';
import { describe, expect, it, vi } from 'vitest';

import { typographyStyles } from '@ds/typography';

import { AdminUiProvider, useAuiDirection, useAuiLabels, useAuiLink, useAuiLocale } from '..';

import styles from '../styles.module.css';

const providerDir = dirname(fileURLToPath(import.meta.url));

const LabelsProbe = () => {
    const { clear, close } = useAuiLabels();

    return (
        <>
            <span data-test-id="clear">{clear}</span>
            <span data-test-id="close">{close}</span>
        </>
    );
};

const LocaleProbe = () => {
    const locale = useAuiLocale();

    return <span data-test-id="locale">{locale}</span>;
};

const DirectionProbe = () => {
    const direction = useAuiDirection();

    return <span data-test-id="direction">{direction}</span>;
};

const LinkProbe = () => {
    const Link = useAuiLink();

    return <Link href="/orders">Orders</Link>;
};

const RouterLink = ({ children, ...props }: ComponentPropsWithRef<'a'>) => (
    <a {...props} data-test-id="router-link">
        {children}
    </a>
);

describe('AdminUiProvider', () => {
    it('uses Russian built-in labels', () => {
        render(
            <AdminUiProvider>
                <LabelsProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('clear')).toHaveTextContent('Очистить');
        expect(screen.getByTestId('close')).toHaveTextContent('Закрыть');
    });

    it('overrides one label and keeps the other built-in strings', () => {
        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <LabelsProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('clear')).toHaveTextContent('Clear');
        expect(screen.getByTestId('close')).toHaveTextContent('Закрыть');
    });

    it('exposes the given locale', () => {
        render(
            <AdminUiProvider locale="en-US">
                <LocaleProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
    });

    it('defaults locale to ru-RU and text direction to ltr', () => {
        render(
            <AdminUiProvider data-test-id="aui-root">
                <LocaleProbe />
                <DirectionProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('locale')).toHaveTextContent('ru-RU');
        expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
        expect(screen.getByTestId('aui-root')).toHaveAttribute('dir', 'ltr');
    });

    it('uses the locale text direction when direction is omitted', () => {
        render(
            <AdminUiProvider locale="ar-EG" data-test-id="aui-root">
                <DirectionProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
        expect(screen.getByTestId('aui-root')).toHaveAttribute('dir', 'rtl');
    });

    it('lets direction override the locale', () => {
        render(
            <AdminUiProvider locale="ar-EG" direction="ltr" data-test-id="aui-root">
                <DirectionProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
        expect(screen.getByTestId('aui-root')).toHaveAttribute('dir', 'ltr');
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

    it('resets descendant margin at zero specificity', () => {
        const css = readFileSync(resolve(providerDir, '../styles.module.css'), 'utf8');

        expect(css).toMatch(/:where\(\.root \*\)\s*\{[^}]*margin:\s*0/s);
        expect(css).not.toMatch(/(^|\n)\.root \*\s*\{[^}]*margin:\s*0/s);
    });

    it('renders a div root by default', () => {
        render(
            <AdminUiProvider data-test-id="aui-root">
                <span>child</span>
            </AdminUiProvider>
        );

        expect(screen.getByTestId('aui-root').tagName).toBe('DIV');
    });

    it('renders the root as the given element', () => {
        render(
            <AdminUiProvider as="section" data-test-id="aui-root">
                <span>child</span>
            </AdminUiProvider>
        );

        expect(screen.getByTestId('aui-root').tagName).toBe('SECTION');
        expect(screen.getByTestId('aui-root')).toHaveClass(styles.root);
    });

    it('merges className onto the root', () => {
        render(
            <AdminUiProvider className="host" data-test-id="aui-root">
                <span>child</span>
            </AdminUiProvider>
        );

        expect(screen.getByTestId('aui-root')).toHaveClass(styles.root, 'host');
    });

    it('uses document.body as the root', async () => {
        const ref = { current: null as HTMLBodyElement | null };
        // RTL mounts into a div, so a nested <body> is not the document body.
        const root = createRoot(document.documentElement);

        try {
            await act(async () => {
                root.render(
                    <AdminUiProvider as="body" ref={ref} data-test-id="aui-root" direction="rtl">
                        <span>Page</span>
                    </AdminUiProvider>
                );
            });

            expect(ref.current).toBe(document.body);
            expect(document.body).toHaveAttribute('data-test-id', 'aui-root');
            expect(document.body).toHaveAttribute('dir', 'rtl');
            expect(document.body).toHaveClass(styles.root, typographyStyles.bodyM);
            expect(document.body).toHaveTextContent('Page');
        } finally {
            await act(async () => {
                root.unmount();
            });
        }
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

    it.each([
        ['labels', useAuiLabels],
        ['locale', useAuiLocale],
        ['direction', useAuiDirection],
        ['link', useAuiLink],
    ] as const)('throws when %s is read outside the provider', (_, read) => {
        const Probe = () => {
            read();

            return null;
        };

        expect(() => renderBare(<Probe />)).toThrow(
            'AdminUiProvider is required. Wrap the app with <AdminUiProvider>.'
        );
    });

    it('renders the host link component', () => {
        render(
            <AdminUiProvider linkComponent={RouterLink}>
                <LinkProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('router-link')).toHaveAttribute('href', '/orders');
        expect(screen.getByRole('link', { name: 'Orders' })).toHaveTextContent('Orders');
    });

    it('defaults the host link to an anchor', () => {
        render(
            <AdminUiProvider>
                <LinkProbe />
            </AdminUiProvider>
        );

        const link = screen.getByRole('link', { name: 'Orders' });

        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/orders');
        expect(screen.queryByTestId('router-link')).not.toBeInTheDocument();
    });
});
