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

        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Загрузка подсказок');
    });

    it('renders error message', () => {
        render(
            <AdminUiProvider>
                <ComboboxListStatus isError />
            </AdminUiProvider>
        );

        expect(screen.getByRole('status')).toHaveTextContent('Не удалось загрузить подсказки');
    });

    it('renders empty message', () => {
        render(
            <AdminUiProvider>
                <ComboboxListStatus isEmpty />
            </AdminUiProvider>
        );

        expect(screen.getByRole('status')).toHaveTextContent('Ничего не найдено');
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
