import { type Key } from 'react-aria-components';

import { type IComboboxOption, type TComboboxValue } from './types';

/**
 * Resolves selected keys to options in key order.
 * Missing keys fall back to `{ value, label: String(key) }`.
 */
export const resolveSelectedOptions = (
    keys: readonly Key[],
    optionsByValue: ReadonlyMap<TComboboxValue, IComboboxOption>
): IComboboxOption[] =>
    keys.map(key => {
        const value = key as TComboboxValue;
        const found = optionsByValue.get(value);

        if (found) {
            return found;
        }

        return { value, label: String(key) };
    });

/** True when click originated from remove / nested button chrome (not tag body). */
export const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return Boolean(target.closest('[slot="remove"], button'));
};

/** Normalize RAC value to a key list for tag remove / clear. */
export const toKeyList = (value: unknown): Key[] => (Array.isArray(value) ? value : []);
