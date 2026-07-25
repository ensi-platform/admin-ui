import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@/checkbox';
import { Form } from '@/form';

import { FormCheckboxGroup } from '..';

describe('FormCheckboxGroup', () => {
    it('submits selected string[]', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ tags: [] as string[] }} onSubmit={onSubmit}>
                <FormCheckboxGroup name="tags" label="Tags">
                    <Checkbox value="a">A</Checkbox>
                    <Checkbox value="b">B</Checkbox>
                </FormCheckboxGroup>
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('checkbox', { name: 'A' }));
        await user.click(screen.getByRole('checkbox', { name: 'B' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ tags: ['a', 'b'] });
    });

    it('sets data-test-id on Field root', () => {
        render(
            <Form initialValues={{ tags: [] as string[] }} onSubmit={vi.fn()}>
                <FormCheckboxGroup name="tags" label="Tags" dataTestId="tags-field">
                    <Checkbox value="a">A</Checkbox>
                </FormCheckboxGroup>
            </Form>
        );

        expect(screen.getByTestId('tags-field')).toBeInTheDocument();
    });

    it('renders without label and with hint', () => {
        render(
            <Form initialValues={{ tags: undefined }} onSubmit={vi.fn()}>
                <FormCheckboxGroup name="tags" hint="Pick at least one" aria-label="Tags">
                    <Checkbox value="a">A</Checkbox>
                </FormCheckboxGroup>
            </Form>
        );

        expect(screen.queryByText('Tags')).not.toBeInTheDocument();
        expect(screen.getByText('Pick at least one')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'A' })).not.toBeChecked();
    });
});
