import { type ReactElement, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import drawerStyles from '@/drawer/styles.module.css';
import { AdminUiProvider } from '@/provider';

import { ArrangementSettings } from '..';
import { type IArrangementSettingsItem } from '../types';

import listStyles from '../components/List/styles.module.css';

import type * as ReactAriaComponents from 'react-aria-components';

interface IDndOptions {
    getItems: (keys: Set<string>) => Record<string, string>[];
    renderDropIndicator: (target: { type: string; key: string; dropPosition: string }) => ReactElement;
    renderDragPreview: (dragged: Record<string, string>[]) => ReactElement;
    onReorder: (event: { keys: Set<string>; target: { type: string; key?: string; dropPosition?: string } }) => void;
}

const dnd = vi.hoisted(() => ({
    options: null as IDndOptions | null,
}));

vi.mock('react-aria-components', async () => {
    const actual = await vi.importActual<typeof ReactAriaComponents>('react-aria-components');

    return {
        ...actual,
        useDragAndDrop: (options: IDndOptions) => {
            dnd.options = options;

            return { dragAndDropHooks: {} };
        },
    };
});

const items: IArrangementSettingsItem[] = [
    { id: 'name', label: 'Name' },
    { id: 'date', label: 'Date' },
];

const Harness = ({
    onSave,
    initial = ['name', 'date'],
    fields = items,
    placement,
}: {
    onSave: (value: string[]) => void;
    initial?: string[];
    fields?: IArrangementSettingsItem[];
    placement?: 'left' | 'right';
}) => {
    const [open, setOpen] = useState(true);
    const [value, setValue] = useState(initial);

    return (
        <AdminUiProvider>
            <button type="button" onClick={() => setOpen(true)}>
                Open
            </button>
            <ArrangementSettings
                open={open}
                onOpenChange={setOpen}
                title="Columns"
                items={fields}
                value={value}
                onSave={next => {
                    onSave(next);
                    setValue(next);
                }}
                dataTestId="settings"
                placement={placement}
            />
        </AdminUiProvider>
    );
};

describe('ArrangementSettings', () => {
    it('saves visibility and drops a hidden field from the order', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} initial={['name']} />);

        expect(screen.queryByRole('tab')).not.toBeInTheDocument();
        expect(screen.getByRole('grid', { name: 'Items' })).toBeInTheDocument();

        await user.click(screen.getByRole('checkbox', { name: /Date/ }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onSave).toHaveBeenCalledWith(['name', 'date']);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('turns a checked item off and saves the rest', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} />);

        await user.click(screen.getByRole('checkbox', { name: /Name/ }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onSave).toHaveBeenCalledWith(['date']);
    });

    it('opens from the right when placement is right', () => {
        render(<Harness onSave={vi.fn()} placement="right" />);

        expect(screen.getByRole('dialog').parentElement).toHaveClass(drawerStyles.panelRight);
    });

    it('discards the draft on cancel', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} />);

        await user.click(screen.getByRole('checkbox', { name: /Name/ }));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onSave).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByRole('checkbox', { name: /Name/ })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: /Date/ })).toBeChecked();
    });

    it('reorders from a drag preview and ignores a drop onto the item', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} />);

        const { options } = dnd;

        expect(options).not.toBeNull();

        expect(options!.getItems(new Set(['name', 'missing']))).toEqual([
            { 'text/plain': 'Name', 'arrangement-item-id': 'name' },
            { 'text/plain': 'missing', 'arrangement-item-id': 'missing' },
        ]);

        expect(options!.renderDropIndicator({ type: 'item', key: 'name', dropPosition: 'before' }).type).toBeTruthy();

        const name = document.querySelector<HTMLElement>('[data-arrangement-id="name"]');
        const date = document.querySelector<HTMLElement>('[data-arrangement-id="date"]');

        expect(name).not.toBeNull();
        expect(date).not.toBeNull();

        Object.defineProperty(name, 'offsetWidth', { value: 180 });

        const label = name!.querySelector('label') ?? name!;
        const box = document.createElement('span');
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        label.prepend(box);
        label.append(icon);
        box.id = 'box-id';

        date!.querySelector('label')?.replaceChildren();

        const missing = options!.renderDragPreview([]);

        expect(render(missing).container.querySelector(`.${listStyles.preview}`)).toBeNull();

        const plain = render(options!.renderDragPreview([{ 'arrangement-item-id': 'date' }]));

        expect(plain.container.querySelector(`.${listStyles.preview}`)).toBeInTheDocument();
        plain.unmount();

        const preview = render(options!.renderDragPreview([{ 'arrangement-item-id': 'name' }]));
        const node = preview.container.querySelector(`.${listStyles.preview}`);

        expect(node).toHaveStyle({ width: '180px' });
        expect(node?.querySelector('[id]')).toBeNull();
        expect(node?.innerHTML).toContain('Name');
        preview.unmount();

        options!.onReorder({ keys: new Set(['date']), target: { type: 'root' } });
        options!.onReorder({ keys: new Set(['date']), target: { type: 'item', key: 'name', dropPosition: 'on' } });
        options!.onReorder({
            keys: new Set(['date']),
            target: { type: 'item', key: 'name', dropPosition: 'before' },
        });

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onSave).toHaveBeenCalledWith(['date', 'name']);
    });

    it('hides a row when its field leaves the item list', () => {
        const onSave = vi.fn();
        const { rerender } = render(<Harness onSave={onSave} />);

        expect(screen.getByRole('checkbox', { name: /Date/ })).toBeInTheDocument();

        rerender(<Harness onSave={onSave} fields={[{ id: 'name', label: 'Name' }]} />);

        expect(screen.queryByRole('checkbox', { name: /Date/ })).not.toBeInTheDocument();
    });
});
