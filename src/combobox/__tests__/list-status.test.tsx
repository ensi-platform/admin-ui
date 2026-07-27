import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { ComboboxListStatus } from '../components/ListStatus';

describe('ComboboxListStatus', () => {
    it('renders loading skeleton', () => {
        render(
            <AdminUiProvider>
                <ComboboxListStatus isLoading />
            </AdminUiProvider>
        );

        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading suggestions');
    });

    it('renders error message', () => {
        render(
            <AdminUiProvider>
                <ComboboxListStatus isError />
            </AdminUiProvider>
        );

        expect(screen.getByRole('status')).toHaveTextContent('Failed to load suggestions');
    });

    it('renders empty message', () => {
        render(
            <AdminUiProvider>
                <ComboboxListStatus isEmpty />
            </AdminUiProvider>
        );

        expect(screen.getByRole('status')).toHaveTextContent('No suggestions');
    });

    it('returns null when idle', () => {
        render(
            <AdminUiProvider>
                <ComboboxListStatus />
            </AdminUiProvider>
        );

        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
