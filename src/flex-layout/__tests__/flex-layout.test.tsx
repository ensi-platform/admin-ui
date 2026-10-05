import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FlexLayout } from '..';

import itemStyles from '../components/Item/styles.module.css';
import styles from '../styles.module.css';

describe('FlexLayout', () => {
    it('lays out a row with gap, alignment, and a growing item', () => {
        render(
            <FlexLayout gap={8} align="center" justify="between" dataTestId="row">
                <FlexLayout.Item grow dataTestId="title">
                    Title
                </FlexLayout.Item>
                <span>Save</span>
            </FlexLayout>
        );

        expect(screen.getByTestId('row')).toHaveClass(styles.gap8, styles.center, styles.between);
        expect(screen.getByTestId('row')).not.toHaveClass(styles.column, styles.wrap);
        expect(screen.getByTestId('title')).toHaveClass(itemStyles.grow);
        expect(screen.getByTestId('title')).toHaveTextContent('Title');
    });

    it('stacks items, wraps, and can leave the layout', () => {
        render(
            <FlexLayout direction="column" align="start" wrap hidden dataTestId="stack">
                Block
            </FlexLayout>
        );

        expect(screen.getByTestId('stack')).toHaveClass(styles.column, styles.start, styles.wrap, styles.gap16);
        expect(screen.getByTestId('stack')).toHaveAttribute('hidden');
    });
});
