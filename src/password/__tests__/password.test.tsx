import { type ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { Password } from '..';

const renderPassword = (props?: Partial<ComponentProps<typeof Password>>) =>
    render(
        <AdminUiProvider labels={{ showPassword: 'Show password', hidePassword: 'Hide password' }}>
            <Password aria-label="Password" {...props} />
        </AdminUiProvider>
    );

describe('Password', () => {
    it('hides typed characters until the toggle is pressed', async () => {
        const user = userEvent.setup();

        renderPassword();

        const input = screen.getByLabelText('Password');

        expect(input).toHaveAttribute('type', 'password');
        expect(input).toHaveAttribute('autocomplete', 'current-password');

        await user.type(input, 'secret');
        await user.click(screen.getByRole('button', { name: 'Show password' }));

        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveValue('secret');

        await user.click(screen.getByRole('button', { name: 'Hide password' }));

        expect(input).toHaveAttribute('type', 'password');
    });

    it('keeps a custom autocomplete value', () => {
        renderPassword({ autoComplete: 'new-password' });

        expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password');
    });

    it('hides the toggle when disabled or read-only', () => {
        const { rerender } = render(
            <AdminUiProvider labels={{ showPassword: 'Show password', hidePassword: 'Hide password' }}>
                <Password aria-label="Password" disabled />
            </AdminUiProvider>
        );

        expect(screen.queryByRole('button', { name: 'Show password' })).not.toBeInTheDocument();

        rerender(
            <AdminUiProvider labels={{ showPassword: 'Show password', hidePassword: 'Hide password' }}>
                <Password aria-label="Password" readOnly value="secret" />
            </AdminUiProvider>
        );

        expect(screen.queryByRole('button', { name: 'Show password' })).not.toBeInTheDocument();
    });

    it('places the custom right addon before the toggle', () => {
        renderPassword({ value: 'secret', rightAddon: <span>copy</span> });

        const addon = screen.getByText('copy');
        const toggle = screen.getByRole('button', { name: 'Show password' });
        const indexOf = (node: Element) => Array.from(node.parentElement?.children ?? []).indexOf(node);

        expect(indexOf(addon)).toBeLessThan(indexOf(toggle));
    });

    it('has no axe violations', async () => {
        const { container } = renderPassword();

        expect(await axe(container)).toHaveNoViolations();
    });
});
