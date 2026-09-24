import { useLayoutEffect, useState } from 'react';

import { type TComboboxSize } from '../../types';

const ROW_VAR: Record<TComboboxSize, string> = {
    sm: '--aui-combobox-item-h-sm',
    md: '--aui-combobox-item-h-md',
    lg: '--aui-combobox-item-h-lg',
};

const PAD_VAR: Record<TComboboxSize, string> = {
    sm: '--aui-combobox-list-pad-sm',
    md: '--aui-combobox-list-pad-md',
    lg: '--aui-combobox-list-pad-lg',
};

/** Pixel fallbacks when tokens are not on the document yet. */
const FALLBACK_ROW: Record<TComboboxSize, number> = { sm: 28, md: 32, lg: 44 };
const FALLBACK_PAD: Record<TComboboxSize, number> = { sm: 4, md: 4, lg: 8 };

export const readCssPx = (name: string, fallback: number): number => {
    if (typeof document === 'undefined') {
        return fallback;
    }

    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);

    return Number.isFinite(value) && value >= 0 ? value : fallback;
};

export const readComboboxListMetrics = (size: TComboboxSize) => ({
    rowSize: readCssPx(ROW_VAR[size], FALLBACK_ROW[size]),
    padding: readCssPx(PAD_VAR[size], FALLBACK_PAD[size]),
});

/** Row height and list padding for `ListLayout`, read from combobox tokens. */
export const useComboboxListMetrics = (size: TComboboxSize) => {
    const [metrics, setMetrics] = useState(() => readComboboxListMetrics(size));

    useLayoutEffect(() => {
        setMetrics(readComboboxListMetrics(size));
    }, [size]);

    return metrics;
};
