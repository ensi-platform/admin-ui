import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import drawerStyles from '@/drawer/styles.module.css';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { ArrangementSettings } from '..';
import { type IArrangementSettingsItem } from '../types';

import listStyles from '../components/List/styles.module.css';

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
        expect(screen.getByRole('grid', { name: 'Элементы' })).toBeInTheDocument();

        await user.click(screen.getByRole('checkbox', { name: /Date/ }));
        await user.click(screen.getByRole('button', { name: 'Сохранить' }));

        expect(onSave).toHaveBeenCalledWith(['name', 'date']);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('stops the row press from the checkbox', () => {
        render(<Harness onSave={vi.fn()} />);

        const check = document.querySelector(`.${listStyles.check}`);

        expect(check).not.toBeNull();

        const event = new PointerEvent('pointerdown', { bubbles: true, cancelable: true });
        const stop = vi.spyOn(event, 'stopPropagation');

        check!.dispatchEvent(event);

        expect(stop).toHaveBeenCalled();
    });

    it('toggles a row from a click on the label', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} />);

        await user.click(screen.getByText('Name'));
        await user.click(screen.getByRole('button', { name: 'Сохранить' }));

        expect(onSave).toHaveBeenCalledWith(['date']);
    });

    it('turns a checked item off and saves the rest', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} />);

        await user.click(screen.getByRole('checkbox', { name: /Name/ }));
        await user.click(screen.getByRole('button', { name: 'Сохранить' }));

        expect(onSave).toHaveBeenCalledWith(['date']);
    });

    it('opens from the right when placement is right', () => {
        render(<Harness onSave={vi.fn()} placement="right" />);

        expect(screen.getByRole('dialog').parentElement).toHaveClass(drawerStyles.panelRight);
    });

    it('calls onExitComplete after dismiss', async () => {
        const user = userEvent.setup();
        const onExitComplete = vi.fn();

        const ExitHarness = () => {
            const [open, setOpen] = useState(true);

            return (
                <AdminUiProvider>
                    <ArrangementSettings
                        open={open}
                        onOpenChange={setOpen}
                        title="Columns"
                        items={items}
                        value={['name', 'date']}
                        onSave={vi.fn()}
                        onExitComplete={onExitComplete}
                    />
                </AdminUiProvider>
            );
        };

        render(<ExitHarness />);

        await user.click(screen.getByRole('checkbox', { name: /Name/ }));
        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(onExitComplete).toHaveBeenCalledTimes(1);
        });
    });

    it('discards the draft on dismiss', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} />);

        await user.click(screen.getByRole('checkbox', { name: /Name/ }));
        await user.keyboard('{Escape}');

        expect(onSave).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByRole('checkbox', { name: /Name/ })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: /Date/ })).toBeChecked();
    });

    it('hides a row when its field leaves the item list', () => {
        const onSave = vi.fn();
        const { rerender } = render(<Harness onSave={onSave} />);

        expect(screen.getByRole('checkbox', { name: /Date/ })).toBeInTheDocument();

        rerender(<Harness onSave={onSave} fields={[{ id: 'name', label: 'Name' }]} />);

        expect(screen.queryByRole('checkbox', { name: /Date/ })).not.toBeInTheDocument();
    });

    it('saves visible ids in list order and drops unknown ids', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} initial={['date', 'ghost', 'name']} />);

        await user.click(screen.getByRole('button', { name: 'Сохранить' }));

        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(['date', 'name']);
    });

    it('toggles a checkbox once with Space', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(<Harness onSave={onSave} />);

        const name = screen.getByRole('checkbox', { name: /Name/ });

        name.focus();
        await user.keyboard(' ');
        await user.click(screen.getByRole('button', { name: 'Сохранить' }));

        expect(name).not.toBeChecked();
        expect(onSave).toHaveBeenCalledWith(['date']);
    });

    it('opens from the left by default', () => {
        render(<Harness onSave={vi.fn()} />);

        expect(screen.getByRole('dialog').parentElement).toHaveClass(drawerStyles.panelLeft);
    });

    it('puts data-test-id on the dialog', () => {
        render(<Harness onSave={vi.fn()} />);

        expect(screen.getByRole('dialog')).toHaveAttribute('data-test-id', 'settings');
    });

    it('uses overridden save and list labels', () => {
        render(
            <AdminUiProvider labels={{ save: 'Apply', arrangementList: 'Fields' }}>
                <ArrangementSettings open title="Columns" items={items} value={['name', 'date']} onSave={vi.fn()} />
            </AdminUiProvider>
        );

        expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
        expect(screen.getByRole('grid', { name: 'Fields' })).toBeInTheDocument();
    });

    it('has no axe violations when open', async () => {
        const { baseElement } = render(<Harness onSave={vi.fn()} />);

        expect(await axe(baseElement)).toHaveNoViolations();
    });
});
