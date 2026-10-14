import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@/checkbox';

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
