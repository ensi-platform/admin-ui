import { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import numberInputStyles from '@/number-input/styles.module.css';
import { AdminUiProvider } from '@/provider';

import { NumberRange } from '..';
import { type INumberRangeValue } from '../types';

import styles from '../styles.module.css';

const Harness = ({
    initial,
    clear,
    onChange,
}: {
    initial: INumberRangeValue;
    clear?: boolean;
    onChange: (value: INumberRangeValue) => void;
}) => {
    const [value, setValue] = useState(initial);

    return (
        <NumberRange
            fromLabel="From"
            toLabel="To"
            clear={clear}
            value={value}
            onChange={next => {
                onChange(next);
                setValue(next);
            }}
        />
    );
};

describe('NumberRange', () => {
    it('renders two inputs with default size md and dataTestId', () => {
        render(<NumberRange fromLabel="From" toLabel="To" dataTestId="range" />);

        const inputs = screen.getAllByRole('textbox');

        expect(inputs).toHaveLength(2);
        expect(screen.getByRole('textbox', { name: 'From' }).closest(`.${numberInputStyles.md}`)).toBeTruthy();
        expect(screen.getByRole('textbox', { name: 'To' }).closest(`.${numberInputStyles.md}`)).toBeTruthy();
        expect(screen.getByTestId('range')).toBeInTheDocument();
    });

    it('does not touch the other side when one side is empty', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial={{ from: null, to: 10 }} onChange={onChange} />);

        await user.type(screen.getByRole('textbox', { name: 'From' }), '4');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 4, to: 10 });
    });

    it('pulls to when from is greater than to', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial={{ from: 1, to: 5 }} onChange={onChange} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '8');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 8, to: 8 });
    });

    it('pulls from when to is less than from', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Harness initial={{ from: 8, to: 10 }} onChange={onChange} />);

        const to = screen.getByRole('textbox', { name: 'To' });
        await user.clear(to);
        await user.type(to, '3');
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toEqual({ from: 3, to: 3 });
    });

    it('sets null only on the changed side when cleared', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <Harness initial={{ from: 1, to: 5 }} clear onChange={onChange} />
            </AdminUiProvider>
        );

        const [clearFrom] = screen.getAllByRole('button', { name: 'Clear' });
        await user.click(clearFrom);

        expect(onChange).toHaveBeenCalledWith({ from: null, to: 5 });
    });

    it('does not stretch the fields when block is off', () => {
        render(<NumberRange fromLabel="From" toLabel="To" block={false} dataTestId="range" />);

        expect(screen.getByTestId('range')).not.toHaveClass(styles.block);
    });

    it('stores an uncontrolled draft', async () => {
        const user = userEvent.setup();

        render(<NumberRange fromLabel="From" toLabel="To" defaultValue={{ from: 1, to: null }} />);

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '6');
        await user.tab();

        expect(from).toHaveValue('6');
    });
});
