import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from '..';

import styles from '../styles.module.css';

describe('Avatar', () => {
    it('renders initials from name', () => {
        render(<Avatar name="Alex Smith" dataTestId="av" />);

        expect(screen.getByTestId('av')).toHaveTextContent('AS');
    });

    it('renders explicit initials', () => {
        render(<Avatar name="Alex Smith" initials="AC" />);

        expect(screen.getByText('AC')).toBeInTheDocument();
    });

    it('renders image when src is set', () => {
        render(<Avatar name="Alex" src="/photo.png" />);

        expect(screen.getByRole('img', { name: 'Alex' })).toHaveAttribute('src', '/photo.png');
    });

    it('uses empty alt when src is set without name', () => {
        const { container } = render(<Avatar src="/photo.png" />);

        expect(container.querySelector('img')).toHaveAttribute('alt', '');
    });

    it('renders children over initials', () => {
        render(
            <Avatar name="Alex" dataTestId="av">
                <span>★</span>
            </Avatar>
        );

        expect(screen.getByTestId('av')).toHaveTextContent('★');
        expect(screen.getByTestId('av')).not.toHaveTextContent('AL');
    });

    it('applies size class', () => {
        render(<Avatar name="A" size="sm" dataTestId="av" />);

        expect(screen.getByTestId('av')).toHaveClass(styles.sm);
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Avatar name="A" dataTestId="user-avatar" />);

        expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    });

    it('renders empty text when name is missing or whitespace', () => {
        const { rerender } = render(<Avatar dataTestId="av" />);

        expect(screen.getByTestId('av')).toHaveTextContent('');
        expect(screen.getByTestId('av')).toHaveAttribute('aria-hidden', 'true');

        rerender(<Avatar name="   " dataTestId="av" />);

        expect(screen.getByTestId('av')).toHaveTextContent('');
    });
});
