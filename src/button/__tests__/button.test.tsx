import { type SVGProps } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../index';

import styles from '../styles.module.css';

const TestIcon = (props: SVGProps<SVGSVGElement>) => <svg data-test-id="test-icon" {...props} />;

describe('Button', () => {
    it('renders children', () => {
        render(<Button>Save</Button>);

        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Button dataTestId="save-btn">Save</Button>);

        expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        render(
            <Button size="sm" variant="primary">
                Save
            </Button>
        );

        const button = screen.getByRole('button', { name: 'Save' });

        expect(button).toHaveClass(styles.root);
        expect(button).toHaveClass(styles.sm);
        expect(button).toHaveClass(styles.primary);
    });

    it('applies secondary and danger variant classes', () => {
        const { rerender } = render(<Button variant="secondary">Cancel</Button>);

        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(styles.secondary);

        rerender(<Button variant="danger">Delete</Button>);

        expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(styles.danger);
    });

    it('applies block class when block is true', () => {
        render(<Button block>Save</Button>);

        expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(styles.block);
    });

    it('calls onClick when enabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<Button onClick={onClick}>Save</Button>);

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <Button disabled onClick={onClick}>
                Save
            </Button>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onClick).not.toHaveBeenCalled();
    });

    it('renders as anchor when as="a"', () => {
        render(
            <Button as="a" href="/path">
                Save
            </Button>
        );

        const link = screen.getByRole('link', { name: 'Save' });

        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/path');
    });

    it('defaults type to button for native button', () => {
        render(<Button>Save</Button>);

        expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
    });

    it('renders icon before children by default', () => {
        render(<Button icon={{ Component: TestIcon }}>Save</Button>);

        const button = screen.getByRole('button', { name: 'Save' });
        const icon = screen.getByTestId('test-icon');

        expect(button.firstElementChild).toBe(icon);
    });

    it('renders icon after children when after is true', () => {
        render(<Button icon={{ Component: TestIcon, after: true }}>Save</Button>);

        const button = screen.getByRole('button', { name: 'Save' });
        const icon = screen.getByTestId('test-icon');

        expect(button.lastElementChild).toBe(icon);
    });

    it('sets --button-icon-indent when icon.indent is provided', () => {
        render(
            <Button icon={{ Component: TestIcon, indent: 8 }} dataTestId="indent-btn">
                Save
            </Button>
        );

        expect(screen.getByTestId('indent-btn')).toHaveStyle({ '--button-icon-indent': '8px' });
    });

    it('renders icon with icon class and a11y attrs', () => {
        render(<Button icon={{ Component: TestIcon }}>Save</Button>);

        const icon = screen.getByTestId('test-icon');

        expect(icon).toHaveClass(styles.icon);
        expect(icon).toHaveAttribute('aria-hidden', 'true');
        expect(icon).toHaveAttribute('focusable', 'false');
    });

    it('applies icon size and fill as CSS variables', () => {
        render(<Button icon={{ Component: TestIcon, size: 20, fill: '#3d3d3d' }}>Save</Button>);

        expect(screen.getByTestId('test-icon')).toHaveStyle({
            '--icon-size': '20px',
            '--icon-fill': '#3d3d3d',
        });
    });

    it('merges icon className', () => {
        render(<Button icon={{ Component: TestIcon, className: 'extra' }}>Save</Button>);

        expect(screen.getByTestId('test-icon')).toHaveClass(styles.icon, 'extra');
    });
});
