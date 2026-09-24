import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Filters } from '..';

describe('Filters', () => {
    it('sets the cell column span from the kind map', () => {
        render(
            <Filters dataTestId="filters">
                <Filters.Grid columns={4} span={{ text: 1, date: 2 }} dataTestId="grid">
                    <Filters.Cell kind="text" dataTestId="text">
                        Name
                    </Filters.Cell>
                    <Filters.Cell kind="date" dataTestId="date">
                        Date
                    </Filters.Cell>
                </Filters.Grid>
            </Filters>
        );

        expect(screen.getByTestId('filters')).toBeInTheDocument();
        expect(screen.getByTestId('grid')).toHaveStyle({ '--aui-filters-columns': '4' });
        expect(screen.getByTestId('text')).toHaveStyle({ '--aui-filters-span': '1' });
        expect(screen.getByTestId('date')).toHaveStyle({ '--aui-filters-span': '2' });
    });

    it('renders footer slots', () => {
        render(
            <Filters>
                <Filters.Footer dataTestId="footer">
                    <button type="button">Reset</button>
                    <button type="submit">Apply</button>
                </Filters.Footer>
            </Filters>
        );

        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });
});
