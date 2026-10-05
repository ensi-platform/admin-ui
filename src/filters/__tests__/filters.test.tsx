import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Filters } from '..';

describe('Filters', () => {
    it('renders the body as a plain content slot', () => {
        render(
            <Filters dataTestId="filters">
                <Filters.Body dataTestId="body">Name</Filters.Body>
            </Filters>
        );

        expect(screen.getByTestId('filters')).toBeInTheDocument();
        expect(screen.getByTestId('body')).toHaveTextContent('Name');
        expect(screen.getByTestId('body')).not.toHaveAttribute('style');
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
