import { useCallback, useRef, useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

import { DEFAULT_MAX_PINNED, PIN_STORAGE_PREFIX, togglePinnedCode } from '../utils';

const NONE_KEY = '__none__';
const EMPTY_PINS: string[] = [];

export interface IUsePinnedCodesOptions {
    pinUserId?: string;
    pinnedCodes?: string[];
    defaultPinnedCodes?: string[];
    onPinnedChange?: (codes: string[]) => void;
    maxPinned?: number;
}

export interface IUsePinnedCodesResult {
    pinnedCodes: string[];
    isPinned: (code: string) => boolean;
    togglePin: (code: string) => void;
    canPin: (code: string) => boolean;
}

const deserializePins = (raw: string, fallback: string[]): string[] => {
    try {
        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return fallback;
        }

        return parsed.filter((code): code is string => typeof code === 'string');
    } catch {
        return fallback;
    }
};

/** Controlled / localStorage / in-memory pinned codes for CascadeMenu. */
export const usePinnedCodes = ({
    pinUserId,
    pinnedCodes: pinnedCodesProp,
    defaultPinnedCodes = EMPTY_PINS,
    onPinnedChange,
    maxPinned = DEFAULT_MAX_PINNED,
}: IUsePinnedCodesOptions): IUsePinnedCodesResult => {
    const isControlled = pinnedCodesProp !== undefined;
    const persist = Boolean(pinUserId);
    const pinKey = `${PIN_STORAGE_PREFIX}${pinUserId || NONE_KEY}`;
    const onPinnedChangeRef = useRef(onPinnedChange);
    onPinnedChangeRef.current = onPinnedChange;

    const [lsPins, setLsPins] = useLocalStorage(pinKey, defaultPinnedCodes, {
        deserializer: raw => deserializePins(raw, defaultPinnedCodes),
    });
    const [memPins, setMemPins] = useState(defaultPinnedCodes);

    let pinnedCodes = memPins;

    if (isControlled) {
        pinnedCodes = pinnedCodesProp;
    }

    if (!isControlled && persist) {
        pinnedCodes = lsPins;
    }

    const commit = useCallback(
        (next: string[]) => {
            if (!isControlled && persist) {
                setLsPins(next);
            }

            if (!isControlled && !persist) {
                setMemPins(next);
            }

            onPinnedChangeRef.current?.(next);
        },
        [isControlled, persist, setLsPins]
    );

    const isPinned = useCallback((code: string) => pinnedCodes.includes(code), [pinnedCodes]);

    const canPin = useCallback(
        (code: string) => pinnedCodes.includes(code) || pinnedCodes.length < maxPinned,
        [maxPinned, pinnedCodes]
    );

    const togglePin = useCallback(
        (code: string) => {
            const next = togglePinnedCode(pinnedCodes, code, maxPinned);

            if (next === pinnedCodes) {
                return;
            }

            commit(next);
        },
        [commit, maxPinned, pinnedCodes]
    );

    return { pinnedCodes, isPinned, togglePin, canPin };
};
