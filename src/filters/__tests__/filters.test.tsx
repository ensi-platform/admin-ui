import { render, screen } from '@testing-library/react';
import { render as renderBare } from '@testing-library/react/pure';
import { describe, expect, it } from 'vitest';

import { axe } from '@/test/axe';

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

    it('forwards ref to the section', () => {
        const ref = { current: null as HTMLDivElement | null };

        render(
            <Filters ref={ref} dataTestId="filters">
                <Filters.Body>Name</Filters.Body>
            </Filters>
        );

        expect(ref.current).toBe(screen.getByTestId('filters'));
    });

    it('points refs at the body and the footer', () => {
        const bodyRef = { current: null as HTMLDivElement | null };
        const footerRef = { current: null as HTMLDivElement | null };

        render(
            <Filters>
                <Filters.Body ref={bodyRef} dataTestId="body">
                    Name
                </Filters.Body>
                <Filters.Footer ref={footerRef} dataTestId="footer">
                    <button type="button">Apply</button>
                </Filters.Footer>
            </Filters>
        );

        expect(bodyRef.current).toBe(screen.getByTestId('body'));
        expect(footerRef.current).toBe(screen.getByTestId('footer'));
        expect(footerRef.current).toContainElement(screen.getByRole('button', { name: 'Apply' }));
    });

    it('renders without AdminUiProvider', () => {
        renderBare(
            <Filters dataTestId="filters">
                <Filters.Body>Name</Filters.Body>
            </Filters>
        );

        expect(screen.getByTestId('filters')).toHaveTextContent('Name');
    });

    it('has no axe violations in the default state', async () => {
        const { container } = render(
            <Filters>
                <Filters.Body>Name</Filters.Body>
                <Filters.Footer>
                    <button type="button">Reset</button>
                    <button type="submit">Apply</button>
                </Filters.Footer>
            </Filters>
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
