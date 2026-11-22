import '@testing-library/jest-dom/vitest';

import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

configure({ testIdAttribute: 'data-test-id' });

if (typeof Element !== 'undefined' && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
}

if (typeof globalThis.PointerEvent === 'undefined') {
    class PointerEventPolyfill extends MouseEvent {
        readonly pointerId: number;

        readonly pointerType: string;

        readonly isPrimary: boolean;

        constructor(
            type: string,
            params: MouseEventInit & { pointerId?: number; pointerType?: string; isPrimary?: boolean } = {}
        ) {
            super(type, params);
            this.pointerId = params.pointerId ?? 1;
            this.pointerType = params.pointerType ?? 'mouse';
            this.isPrimary = params.isPrimary ?? true;
        }
    }
    globalThis.PointerEvent = PointerEventPolyfill as typeof PointerEvent;
}

const emptyRect = () => {
    const box = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON() {
            return box;
        },
    };

    return box;
};

if (typeof document !== 'undefined' && typeof document.elementFromPoint !== 'function') {
    document.elementFromPoint = () => null;
}

if (typeof Range !== 'undefined' && typeof Range.prototype.getClientRects !== 'function') {
    Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
    Range.prototype.getBoundingClientRect = emptyRect as typeof Range.prototype.getBoundingClientRect;
}

if (typeof Element !== 'undefined' && typeof Element.prototype.getClientRects !== 'function') {
    Element.prototype.getClientRects = () => [] as unknown as DOMRectList;
    Element.prototype.getBoundingClientRect = emptyRect as typeof Element.prototype.getBoundingClientRect;
}

afterEach(() => {
    cleanup();
});
