import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { axe } from '@/test/axe';

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
        render(
            <Badge size="sm" variant="success">
                Оплачен
            </Badge>
        );

        expect(screen.getByText('Оплачен')).toHaveClass(styles.sm, styles.success);
    });

    it('uses md and neutral by default', () => {
        render(<Badge>Черновик</Badge>);

        expect(screen.getByText('Черновик')).toHaveClass(styles.md, styles.neutral);
    });

    it('has no axe violations', async () => {
        const { container } = render(<Badge variant="danger">Ошибка</Badge>);

        expect(screen.getByText('Ошибка')).toHaveClass(styles.danger);
        expect(await axe(container)).toHaveNoViolations();
    });
});
