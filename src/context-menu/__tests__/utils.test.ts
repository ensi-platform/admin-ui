import { describe, expect, it } from 'vitest';

import { placeContextMenu } from '../utils';

describe('placeContextMenu', () => {
    const viewport = { width: 200, height: 100 };

    it('keeps a menu that already fits', () => {
        expect(placeContextMenu(10, 12, 40, 20, viewport)).toEqual({ left: 10, top: 12 });
    });

    it('shifts left when the menu would leave the right edge', () => {
        expect(placeContextMenu(180, 12, 40, 20, viewport)).toEqual({ left: 152, top: 12 });
    });

    it('flips above the anchor when the menu would leave the bottom edge', () => {
        expect(placeContextMenu(10, 90, 40, 30, viewport)).toEqual({ left: 10, top: 60 });
    });
});
