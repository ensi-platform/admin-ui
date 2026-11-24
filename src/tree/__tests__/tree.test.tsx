import { createRef, type ComponentProps } from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { axe } from '@/test/axe';

import { Tree, type ITreeItem } from '..';

const items: ITreeItem[] = [
    {
        id: 'parent',
        label: 'Parent',
        children: [{ id: 'child', label: 'Child' }],
    },
    { id: 'leaf', label: 'Leaf' },
    { id: 'empty', label: 'Empty', children: [] },
];

const renderTree = (props: Partial<ComponentProps<typeof Tree>> = {}) =>
    render(<Tree aria-label="Categories" items={items} {...props} />);

const row = (name: string) => screen.getByRole('row', { name });

const chevron = (name: string) => within(row(name)).getByRole('button');

describe('Tree', () => {
    it('renders a nested label when the branch is expanded', () => {
        renderTree({ defaultExpandedKeys: new Set(['parent']) });

        expect(row('Parent')).toBeInTheDocument();
        expect(row('Child')).toBeInTheDocument();
        expect(row('Leaf')).toBeInTheDocument();
    });

    it('shows a chevron on a branch only', () => {
        renderTree();

        expect(chevron('Parent')).toBeInTheDocument();
        expect(within(row('Leaf')).queryByRole('button')).not.toBeInTheDocument();
        expect(within(row('Empty')).queryByRole('button')).not.toBeInTheDocument();
    });

    it('expands from the chevron without selecting the row', async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();

        renderTree({ onSelectionChange });

        expect(screen.queryByRole('row', { name: 'Child' })).not.toBeInTheDocument();

        await user.click(chevron('Parent'));

        expect(row('Child')).toBeInTheDocument();
        expect(row('Parent')).not.toHaveAttribute('aria-selected', 'true');
        expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('keeps a single selection on the second click', async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();

        renderTree({ onSelectionChange });

        await user.click(row('Leaf'));
        await user.click(row('Leaf'));

        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');
        expect(onSelectionChange.mock.calls.some(([keys]) => keys !== 'all' && keys.size === 0)).toBe(false);
    });

    it('clears a row on the second click in multiple mode', async () => {
        const user = userEvent.setup();

        renderTree({ selectionMode: 'multiple' });

        await user.click(row('Leaf'));

        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');

        await user.click(row('Leaf'));

        expect(row('Leaf')).toHaveAttribute('aria-selected', 'false');
    });

    it('does not select a row when selection is none', async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();

        renderTree({ selectionMode: 'none', onSelectionChange });

        await user.click(row('Leaf'));

        expect(row('Leaf')).not.toHaveAttribute('aria-selected', 'true');
        expect(onSelectionChange).not.toHaveBeenCalled();

        await user.click(chevron('Parent'));

        expect(row('Child')).toBeInTheDocument();
    });

    it('allows an empty selection', () => {
        renderTree({ selectedKeys: new Set() });

        expect(row('Leaf')).toHaveAttribute('aria-selected', 'false');
        expect(row('Parent')).toHaveAttribute('aria-selected', 'false');
    });

    it('follows selectedKeys and ignores a click the parent does not apply', async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();

        renderTree({ selectedKeys: new Set(['leaf']), onSelectionChange });

        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');

        await user.click(row('Parent'));

        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');
        expect(row('Parent')).toHaveAttribute('aria-selected', 'false');
    });

    it('updates selection from defaultSelectedKeys', async () => {
        const user = userEvent.setup();

        renderTree({ defaultSelectedKeys: new Set(['leaf']) });

        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');

        await user.click(row('Parent'));

        expect(row('Parent')).toHaveAttribute('aria-selected', 'true');
        expect(row('Leaf')).toHaveAttribute('aria-selected', 'false');
    });

    it('follows expandedKeys and ignores a chevron the parent does not apply', async () => {
        const user = userEvent.setup();
        const onExpandedChange = vi.fn();

        renderTree({ expandedKeys: new Set(), onExpandedChange });

        await user.click(chevron('Parent'));

        expect(onExpandedChange).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('row', { name: 'Child' })).not.toBeInTheDocument();
    });

    it('expands from defaultExpandedKeys', () => {
        renderTree({ defaultExpandedKeys: new Set(['parent']) });

        expect(row('Child')).toBeInTheDocument();
    });

    it('selects a row with a numeric id', async () => {
        const user = userEvent.setup();

        render(<Tree aria-label="Categories" items={[{ id: 1, label: 'Root' }]} />);

        await user.click(row('Root'));

        expect(row('Root')).toHaveAttribute('aria-selected', 'true');
    });

    it('does not select or expand when the tree is disabled', async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();
        const onExpandedChange = vi.fn();

        renderTree({ disabled: true, readOnly: true, onSelectionChange, onExpandedChange });

        await user.click(row('Leaf'));
        await user.click(chevron('Parent'));

        expect(row('Leaf')).not.toHaveAttribute('aria-selected', 'true');
        expect(screen.queryByRole('row', { name: 'Child' })).not.toBeInTheDocument();
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(onExpandedChange).not.toHaveBeenCalled();
    });

    it('does not select or expand a disabled row', async () => {
        const user = userEvent.setup();

        render(
            <Tree
                aria-label="Categories"
                items={[
                    {
                        id: 'parent',
                        label: 'Parent',
                        disabled: true,
                        children: [{ id: 'child', label: 'Child' }],
                    },
                    { id: 'leaf', label: 'Leaf' },
                ]}
            />
        );

        await user.click(row('Parent'));
        await user.click(chevron('Parent'));
        await user.click(row('Leaf'));

        expect(row('Parent')).not.toHaveAttribute('aria-selected', 'true');
        expect(screen.queryByRole('row', { name: 'Child' })).not.toBeInTheDocument();
        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');
    });

    it('keeps the selection and still expands when readOnly', async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();

        renderTree({ readOnly: true, defaultSelectedKeys: new Set(['leaf']), onSelectionChange });

        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');

        await user.click(row('Parent'));
        await user.click(chevron('Parent'));

        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(row('Leaf')).toHaveAttribute('aria-selected', 'true');
        expect(row('Parent')).not.toHaveAttribute('aria-selected', 'true');
        expect(row('Child')).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        renderTree({ dataTestId: 'category-tree' });

        expect(screen.getByTestId('category-tree')).toHaveAttribute('aria-label', 'Categories');
    });

    it('assigns object ref', () => {
        const ref = createRef<HTMLDivElement>();

        render(<Tree ref={ref} aria-label="Categories" items={items} />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveAttribute('aria-label', 'Categories');
    });

    it('has no axe violations', async () => {
        const { container } = renderTree();

        expect(await axe(container)).toHaveNoViolations();
    });
});
