import { type ComponentPropsWithoutRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { typographyStyles } from '@ds/typography';

import { Link } from '../index';

import styles from '../styles.module.css';

const CustomLink = ({ children, ...props }: ComponentPropsWithoutRef<'a'> & { to?: string }) => (
    <a {...props} data-custom="true" href={props.to ?? props.href}>
        {children}
    </a>
);

describe('Link', () => {
    it('renders as anchor by default', () => {
        render(<Link href="/orders">Orders</Link>);

        const link = screen.getByRole('link', { name: 'Orders' });

        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/orders');
        expect(link).toHaveClass(styles.root, styles.primary, typographyStyles.bodyS);
    });

    it('applies typography role when set', () => {
        render(
            <Link href="/orders" typography="bodyM">
                Orders
            </Link>
        );

        const link = screen.getByRole('link', { name: 'Orders' });

        expect(link).toHaveClass(typographyStyles.bodyM);
        expect(link).not.toHaveClass(typographyStyles.bodyS);
    });

    it('sets data-test-id from dataTestId', () => {
        render(
            <Link href="/orders" dataTestId="orders-link">
                Orders
            </Link>
        );

        expect(screen.getByTestId('orders-link')).toBeInTheDocument();
    });

    it('merges className', () => {
        render(
            <Link href="/orders" className="extra">
                Orders
            </Link>
        );

        expect(screen.getByRole('link', { name: 'Orders' })).toHaveClass(styles.root, styles.primary, 'extra');
    });

    it('renders as custom component when as is set', () => {
        render(
            <Link as={CustomLink} to="/orders">
                Orders
            </Link>
        );

        const link = screen.getByRole('link', { name: 'Orders' });

        expect(link).toHaveAttribute('href', '/orders');
        expect(link).toHaveAttribute('data-custom', 'true');
        expect(link).toHaveClass(styles.root, styles.primary);
    });
});
