import '@testing-library/jest-dom/vitest';

import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

configure({ testIdAttribute: 'data-test-id' });

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

afterEach(() => {
    cleanup();
});
