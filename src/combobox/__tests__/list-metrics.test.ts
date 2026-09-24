import { afterEach, describe, expect, it, vi } from 'vitest';

import { readCssPx } from '../components/List/metrics';

const styleOf = (raw: string) => ({ getPropertyValue: () => raw }) as unknown as CSSStyleDeclaration;

describe('readCssPx', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('reads a pixel token and falls back for an invalid one', () => {
        vi.spyOn(window, 'getComputedStyle').mockReturnValue(styleOf('12px'));
        expect(readCssPx('--aui-combobox-item-h-md', 7)).toBe(12);

        vi.spyOn(window, 'getComputedStyle').mockReturnValue(styleOf('nope'));
        expect(readCssPx('--aui-combobox-item-h-md', 7)).toBe(7);

        vi.spyOn(window, 'getComputedStyle').mockReturnValue(styleOf('-4'));
        expect(readCssPx('--aui-combobox-item-h-md', 7)).toBe(7);
    });

    it('uses the fallback when document is missing', () => {
        const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');

        Object.defineProperty(globalThis, 'document', { configurable: true, value: undefined });

        try {
            expect(readCssPx('--aui-combobox-item-h-md', 32)).toBe(32);
        } finally {
            if (documentDescriptor) {
                Object.defineProperty(globalThis, 'document', documentDescriptor);
            }
        }
    });
});
