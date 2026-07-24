import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '..';

import styles from '../styles.module.css';

describe('Badge', () => {
    it('renders children', () => {
        render(<Badge>В сборке</Badge>);

        expect(screen.getByText('В сборке')).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Badge dataTestId="status-badge">Оплачен</Badge>);

        expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        const { container } = render(
            <Badge size="sm" variant="success">
                Оплачен
            </Badge>
        );

        expect(container.firstChild).toHaveClass(styles.sm, styles.success);
    });
});
