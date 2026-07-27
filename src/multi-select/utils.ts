import { type Key } from 'react-aria-components';

import { type TComboboxValue } from '@/select/types';

export const toMultiValue = (value: TComboboxValue[] | undefined): readonly Key[] | undefined => {
    if (value === undefined) {
        return undefined;
    }

    return value;
};

export const fromMultiValue = (keys: Key[]): TComboboxValue[] => keys as TComboboxValue[];

/** True when click originated from tag / remove / nested button chrome. */
export const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return Boolean(target.closest('[role="row"], [slot="remove"], button'));
};

/** Normalize RAC select value to a key list for tag remove / clear. */
export const toKeyList = (value: unknown): Key[] => (Array.isArray(value) ? value : []);
