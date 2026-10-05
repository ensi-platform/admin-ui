import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Grid } from '..';

import styles from '../styles.module.css';

describe('Grid', () => {
    it('lays out equal columns and a full-width item', () => {
        render(
            <Grid cols={2} gap={16} dataTestId="grid">
                <Grid.Item dataTestId="cell">Name</Grid.Item>
                <Grid.Item col="full" dataTestId="full">
                    Password
                </Grid.Item>
            </Grid>
        );

        expect(screen.getByTestId('grid')).toHaveClass(styles.gap16);
        expect(screen.getByTestId('grid')).toHaveStyle({
            '--aui-grid-template': 'repeat(2, minmax(0, 1fr))',
        });
        expect(screen.getByTestId('full')).toHaveStyle({ '--aui-grid-col': '1 / -1' });
        expect(screen.getByTestId('cell')).toHaveTextContent('Name');
    });

    it('accepts explicit tracks and hides the grid', () => {
        render(
            <Grid cols={['minmax(0, 1fr)', '16.25rem']} gap={0} hidden dataTestId="split">
                Main
            </Grid>
        );

        expect(screen.getByTestId('split')).toHaveStyle({
            '--aui-grid-template': 'minmax(0, 1fr) 16.25rem',
        });
        expect(screen.getByTestId('split')).toHaveAttribute('hidden');
    });

    it('spans a set number of columns and accepts fr tracks', () => {
        render(
            <Grid cols={[2, 'minmax(0, 1fr)']} col={2} dataTestId="grid">
                <Grid.Item col={2} dataTestId="span">
                    Wide
                </Grid.Item>
            </Grid>
        );

        expect(screen.getByTestId('grid')).toHaveStyle({
            '--aui-grid-template': '2fr minmax(0, 1fr)',
            '--aui-grid-col': 'span 2',
        });
        expect(screen.getByTestId('span')).toHaveStyle({ '--aui-grid-col': 'span 2' });
    });
});
