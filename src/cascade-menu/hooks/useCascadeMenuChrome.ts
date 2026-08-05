import { useCallback, useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

/** localStorage key prefix for L0 expanded width — append pinUserId. */
export const WIDTH_STORAGE_PREFIX = 'aui-cascade-menu-width:';

/** localStorage key prefix for collapsed rail — append pinUserId. */
export const COLLAPSED_STORAGE_PREFIX = 'aui-cascade-menu-collapsed:';

const NONE_KEY = '__none__';

export interface IUseCascadeMenuChromeOptions {
    pinUserId?: string;
    width?: number;
    defaultWidth: number;
    collapsed?: boolean;
    defaultCollapsed: boolean;
    minWidth: number;
    maxWidth: number;
    onWidthChange?: (width: number) => void;
    onCollapsedChange?: (collapsed: boolean) => void;
}

export interface IUseCascadeMenuChromeResult {
    width: number;
    setWidth: (next: number, options?: { persist?: boolean }) => void;
    discardWidthDraft: () => void;
    collapsed: boolean;
    setCollapsed: (next: boolean) => void;
}

const clampWidth = (value: number, minWidth: number, maxWidth: number) => Math.min(maxWidth, Math.max(minWidth, value));

const deserializeWidth = (raw: string, fallback: number, minWidth: number, maxWidth: number): number => {
    try {
        const parsed: unknown = JSON.parse(raw);

        if (typeof parsed !== 'number' || !Number.isFinite(parsed)) {
            return fallback;
        }

        return clampWidth(parsed, minWidth, maxWidth);
    } catch {
        return fallback;
    }
};

/** Accepts JSON boolean and legacy `"1"` / `"0"`. */
const deserializeCollapsed = (raw: string, fallback: boolean): boolean => {
    if (raw === '1' || raw === 'true') {
        return true;
    }

    if (raw === '0' || raw === 'false') {
        return false;
    }

    try {
        const parsed: unknown = JSON.parse(raw);

        if (typeof parsed === 'boolean') {
            return parsed;
        }
    } catch {
        // ignore
    }

    return fallback;
};

/** Controlled → localStorage → memory. */
const pickChromeValue = <T>(controlled: boolean, prop: T | undefined, persist: boolean, ls: T, mem: T): T => {
    if (controlled) {
        return prop as T;
    }

    if (persist) {
        return ls;
    }

    return mem;
};

/** Uncontrolled L0 width + collapsed with optional localStorage via pinUserId. */
export const useCascadeMenuChrome = ({
    pinUserId,
    width: widthProp,
    defaultWidth,
    collapsed: collapsedProp,
    defaultCollapsed,
    minWidth,
    maxWidth,
    onWidthChange,
    onCollapsedChange,
}: IUseCascadeMenuChromeOptions): IUseCascadeMenuChromeResult => {
    const persist = Boolean(pinUserId);
    const widthKey = `${WIDTH_STORAGE_PREFIX}${pinUserId || NONE_KEY}`;
    const collapsedKey = `${COLLAPSED_STORAGE_PREFIX}${pinUserId || NONE_KEY}`;

    const [lsWidth, setLsWidth] = useLocalStorage(widthKey, defaultWidth, {
        deserializer: raw => deserializeWidth(raw, defaultWidth, minWidth, maxWidth),
    });
    const [lsCollapsed, setLsCollapsed] = useLocalStorage(collapsedKey, defaultCollapsed, {
        deserializer: raw => deserializeCollapsed(raw, defaultCollapsed),
    });

    const [memWidth, setMemWidth] = useState(defaultWidth);
    const [memCollapsed, setMemCollapsed] = useState(defaultCollapsed);
    const [widthDraft, setWidthDraft] = useState<number | null>(null);

    const widthControlled = widthProp !== undefined;
    const collapsedControlled = collapsedProp !== undefined;

    const storedWidth = pickChromeValue(widthControlled, widthProp, persist, lsWidth, memWidth);
    const width = widthDraft ?? storedWidth;
    const collapsed = pickChromeValue(collapsedControlled, collapsedProp, persist, lsCollapsed, memCollapsed);

    const setWidth = useCallback(
        (next: number, options?: { persist?: boolean }) => {
            const clamped = clampWidth(next, minWidth, maxWidth);
            const shouldPersist = options?.persist !== false;

            if (widthControlled) {
                setWidthDraft(shouldPersist ? null : clamped);
                onWidthChange?.(clamped);

                return;
            }

            if (!shouldPersist) {
                setWidthDraft(clamped);

                if (!persist) {
                    setMemWidth(clamped);
                }

                onWidthChange?.(clamped);

                return;
            }

            setWidthDraft(null);

            if (persist) {
                setLsWidth(clamped);
            }

            if (!persist) {
                setMemWidth(clamped);
            }

            onWidthChange?.(clamped);
        },
        [maxWidth, minWidth, onWidthChange, persist, setLsWidth, widthControlled]
    );

    const discardWidthDraft = useCallback(() => {
        setWidthDraft(null);
    }, []);

    const setCollapsed = useCallback(
        (next: boolean) => {
            if (!collapsedControlled) {
                if (persist) {
                    setLsCollapsed(next);
                }

                if (!persist) {
                    setMemCollapsed(next);
                }
            }

            onCollapsedChange?.(next);
        },
        [collapsedControlled, onCollapsedChange, persist, setLsCollapsed]
    );

    return { width, setWidth, discardWidthDraft, collapsed, setCollapsed };
};
