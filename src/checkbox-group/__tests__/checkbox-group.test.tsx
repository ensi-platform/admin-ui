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
});
