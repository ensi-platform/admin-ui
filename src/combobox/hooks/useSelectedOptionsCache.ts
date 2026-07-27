import { useMemo, useRef } from 'react';

import { type Key } from 'react-aria-components';

import { type IComboboxOption, type TComboboxValue } from '../types';
import { resolveSelectedOptions } from '../utils';

/**
 * Merges incoming `options` into a persistent value→option map so selected
 * labels survive client filter / async suggest list swaps.
 */
export const useSelectedOptionsCache = (
    keys: readonly Key[],
    options: readonly IComboboxOption[]
): IComboboxOption[] => {
    const cacheRef = useRef(new Map<TComboboxValue, IComboboxOption>());

    return useMemo(() => {
        const cache = cacheRef.current;

        options.forEach(option => {
            cache.set(option.value, option);
        });

        return resolveSelectedOptions(keys, cache);
    }, [keys, options]);
};
