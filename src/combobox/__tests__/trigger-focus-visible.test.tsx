import { createRef, type ReactNode } from 'react';

import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { ComboboxMultiTrigger } from '../components/MultiTrigger';
import { ComboboxTrigger } from '../components/Trigger';

interface ISelectValueValues {
    selectedText: string | null;
    isPlaceholder: boolean;
}

interface ISelectValueProps {
    children?: ReactNode | ((values: ISelectValueValues) => ReactNode);
}

vi.mock('react-aria-components', async importOriginal => {
    const actual = await importOriginal<Record<string, unknown>>();
    return {
        ...actual,
        SelectValue: ({ children }: ISelectValueProps) => (
            <span>
                {typeof children === 'function' ? children({ selectedText: null, isPlaceholder: true }) : children}
            </span>
        ),
    };
});

describe('ComboboxTrigger focus-visible', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sets data-focus-visible in select mode when focus-visible', () => {
        const triggerRef = createRef<HTMLDivElement>();
        const { container } = render(
            <AdminUiProvider>
                <ComboboxTrigger
                    triggerRef={triggerRef}
                    size="md"
                    variant="primary"
                    clear={false}
                    isOpen={false}
                    isDisabled={false}
                    isInvalid={false}
                    mode="select"
                    isFocusVisible
                />
            </AdminUiProvider>
        );

        expect(container.querySelector('[data-focus-visible="true"]')).toBeTruthy();
    });
});

describe('ComboboxMultiTrigger focus-visible', () => {
    it('sets data-focus-visible in select mode when focus-visible', () => {
        const triggerRef = createRef<HTMLDivElement>();
        const { container } = render(
            <AdminUiProvider>
                <ComboboxMultiTrigger
                    triggerRef={triggerRef}
                    options={[{ value: 'a', label: 'Alpha' }]}
                    size="md"
                    variant="primary"
                    clear={false}
                    placeholder="Pick"
                    isOpen={false}
                    isDisabled={false}
                    isInvalid={false}
                    mode="select"
                    isFocusVisible
                    aria-label="Tags"
                />
            </AdminUiProvider>
        );

        expect(container.querySelector('[data-focus-visible="true"]')).toBeTruthy();
    });
});
