import { type ReactNode } from 'react';

import { render } from '@testing-library/react';
import { type Key, type TabsProps } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Tabs } from '..';

vi.mock('react-aria-components', async importOriginal => {
    const actual = await importOriginal<Record<string, unknown>>();

    return {
        ...actual,
        Tabs: ({
            onSelectionChange,
            children,
        }: TabsProps & { children?: ReactNode; onSelectionChange?: (key: Key | null) => void }) => {
            onSelectionChange?.(null);

            return <div>{children}</div>;
        },
    };
});

describe('Tabs null selection', () => {
    it('does not call onChange when RAC reports a null key', () => {
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <Tabs defaultValue="a" onChange={onChange}>
                    {null}
                </Tabs>
            </AdminUiProvider>
        );

        expect(onChange).not.toHaveBeenCalled();
    });
});
