import { describe, expect, it } from 'vitest';

import {
    getRectangle,
    isInsideRectangle,
    isInsideTriangle,
    type IRectangle,
    type ITriangle,
} from '../hooks/useHoverMenu/hoverAim';

const mockEl = (rect: Partial<DOMRect>): HTMLElement =>
    ({
        getBoundingClientRect: () =>
            ({
                top: 0,
                left: 0,
                right: 100,
                bottom: 100,
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                toJSON: () => ({}),
                ...rect,
            }) as DOMRect,
    }) as HTMLElement;

describe('hoverAim', () => {
    describe('getRectangle', () => {
        it('returns undefined for nullish elem', () => {
            expect(getRectangle(null)).toBeUndefined();
            expect(getRectangle(undefined)).toBeUndefined();
        });

        it('maps getBoundingClientRect to corners', () => {
            const el = mockEl({ left: 10, top: 20, right: 110, bottom: 80 });

            expect(getRectangle(el)).toEqual({
                topLeft: { x: 10, y: 20 },
                topRight: { x: 110, y: 20 },
                bottomLeft: { x: 10, y: 80 },
            });
        });

        it('returns undefined when getBoundingClientRect is falsy', () => {
            const el = {
                getBoundingClientRect: () => null,
            } as unknown as HTMLElement;

            expect(getRectangle(el)).toBeUndefined();
        });
    });

    describe('isInsideRectangle', () => {
        const box: IRectangle = {
            topLeft: { x: 0, y: 0 },
            topRight: { x: 100, y: 0 },
            bottomLeft: { x: 0, y: 50 },
        };

        it('returns true for a point inside the box', () => {
            expect(isInsideRectangle(box, { x: 50, y: 25 })).toBe(true);
        });

        it('returns false for a point outside the box', () => {
            expect(isInsideRectangle(box, { x: 150, y: 25 })).toBe(false);
            expect(isInsideRectangle(box, { x: 50, y: 75 })).toBe(false);
        });
    });

    describe('isInsideTriangle', () => {
        const triangle: ITriangle = {
            A: { x: 0, y: 0 },
            B: { x: 100, y: 0 },
            C: { x: 0, y: 100 },
        };

        it('returns true for a point inside the triangle', () => {
            expect(isInsideTriangle(triangle, { x: 10, y: 10 })).toBe(true);
        });

        it('returns false for a point outside the triangle', () => {
            expect(isInsideTriangle(triangle, { x: 90, y: 90 })).toBe(false);
        });
    });
});
