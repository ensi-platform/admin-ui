import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GridLayout } from '..';

import styles from '../styles.module.css';

describe('GridLayout', () => {
    it('lays out equal columns and a full-width item', () => {
        render(
            <GridLayout cols={2} gap={16} dataTestId="grid">
                <GridLayout.Item dataTestId="cell">Name</GridLayout.Item>
                <GridLayout.Item col="full" dataTestId="full">
                    Password
                </GridLayout.Item>
            </GridLayout>
        );

        expect(screen.getByTestId('grid')).toHaveClass(styles.gap16);
        expect(screen.getByTestId('grid')).toHaveStyle({
            '--aui-grid-layout-template': 'repeat(2, minmax(0, 1fr))',
        });
        expect(screen.getByTestId('full')).toHaveStyle({ '--aui-grid-layout-col': '1 / -1' });
        expect(screen.getByTestId('cell')).toHaveTextContent('Name');
    });

    it('accepts explicit tracks and hides the grid', () => {
        render(
            <GridLayout cols={['minmax(0, 1fr)', '16.25rem']} gap={0} hidden dataTestId="split">
                Main
            </GridLayout>
        );

        expect(screen.getByTestId('split')).toHaveStyle({
            '--aui-grid-layout-template': 'minmax(0, 1fr) 16.25rem',
        });
        expect(screen.getByTestId('split')).toHaveAttribute('hidden');
    });

    it('spans a set number of columns and accepts fr tracks', () => {
        render(
            <GridLayout cols={[2, 'minmax(0, 1fr)']} col={2} dataTestId="grid">
                <GridLayout.Item col={2} dataTestId="span">
                    Wide
                </GridLayout.Item>
            </GridLayout>
        );

        expect(screen.getByTestId('grid')).toHaveStyle({
            '--aui-grid-layout-template': '2fr minmax(0, 1fr)',
            '--aui-grid-layout-col': 'span 2',
        });
        expect(screen.getByTestId('span')).toHaveStyle({ '--aui-grid-layout-col': 'span 2' });
    });
});
