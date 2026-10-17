import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@/checkbox';
import { axe } from '@/test/axe';

import { CheckboxGroup } from '..';

describe('CheckboxGroup', () => {
    it('selects values as string[]', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <CheckboxGroup value={['a']} onChange={onChange} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>
        );

        await user.click(screen.getByRole('checkbox', { name: 'B' }));

        expect(onChange).toHaveBeenCalledWith(['a', 'b']);
    });

    it('selects with Space from defaultValue', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <CheckboxGroup defaultValue={['a']} onChange={onChange} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>
        );

        const option = screen.getByRole('checkbox', { name: 'B' });

        expect(screen.getByRole('checkbox', { name: 'A' })).toBeChecked();
        option.focus();
        await user.keyboard(' ');

        expect(onChange).toHaveBeenCalledWith(['a', 'b']);
    });

    it('moves to the next option with Tab and does not select with Enter or ArrowDown', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <CheckboxGroup onChange={onChange} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>
        );

        const first = screen.getByRole('checkbox', { name: 'A' });
        const second = screen.getByRole('checkbox', { name: 'B' });

        first.focus();
        await user.tab();

        expect(second).toHaveFocus();

        await user.keyboard('{Enter}');
        await user.keyboard('{ArrowDown}');

        expect(onChange).not.toHaveBeenCalled();
        expect(second).not.toBeChecked();

        await user.keyboard(' ');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(['b']);
        expect(second).toBeChecked();
    });

    it('sets data-size from size', () => {
        const { rerender } = render(
            <CheckboxGroup dataTestId="tags" aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );

        expect(screen.getByTestId('tags')).toHaveAttribute('data-size', 'md');

        rerender(
            <CheckboxGroup size="lg" dataTestId="tags" aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );

        expect(screen.getByTestId('tags')).toHaveAttribute('data-size', 'lg');
    });

    it('disables every option when the group is disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <CheckboxGroup disabled onChange={onChange} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>
        );

        const first = screen.getByRole('checkbox', { name: 'A' });

        expect(first).toBeDisabled();
        expect(screen.getByRole('checkbox', { name: 'B' })).toBeDisabled();

        await user.click(first);
        first.focus();
        await user.keyboard(' ');

        expect(onChange).not.toHaveBeenCalled();
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(
            <CheckboxGroup value={['a']} onChange={() => undefined} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>
        );

        await user.click(screen.getByRole('checkbox', { name: 'B' }));

        expect(screen.getByRole('checkbox', { name: 'A' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'B' })).not.toBeChecked();
    });

    it('assigns object ref', () => {
        const ref = createRef<HTMLDivElement>();

        render(
            <CheckboxGroup ref={ref} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('follows value and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <CheckboxGroup value={['a']} onChange={onChange} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>
        );

        rerender(
            <CheckboxGroup value={['b']} onChange={onChange} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>
        );

        expect(screen.getByRole('checkbox', { name: 'B' })).toBeChecked();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('sets data-test-id from dataTestId', () => {
        render(
            <CheckboxGroup dataTestId="tags-group" aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );

        expect(screen.getByTestId('tags-group')).toBeInTheDocument();
    });

    it('sets data-invalid when invalid', () => {
        render(
            <CheckboxGroup invalid dataTestId="invalid-group" aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );

        expect(screen.getByTestId('invalid-group')).toHaveAttribute('data-invalid');
        expect(screen.getByRole('checkbox', { name: 'A' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(
            <CheckboxGroup aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(
            <CheckboxGroup disabled aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(
            <CheckboxGroup invalid aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
        );
        expect(await axe(invalid.container)).toHaveNoViolations();
    });

    it('removes a value when it is unchecked and skips a disabled option', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <CheckboxGroup defaultValue={['a', 'b']} onChange={onChange} aria-label="Tags">
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
                <Checkbox value="c" disabled>
                    C
                </Checkbox>
            </CheckboxGroup>
        );

        await user.click(screen.getByRole('checkbox', { name: 'A' }));
        expect(onChange).toHaveBeenCalledWith(['b']);

        await user.click(screen.getByRole('checkbox', { name: 'C' }));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('checkbox', { name: 'C' })).toBeDisabled();
    });
});
