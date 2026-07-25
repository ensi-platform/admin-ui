import { type Key } from 'react-aria-components';

import { type TSelectValue } from '@/select/types';

export const toMultiValue = (value: TSelectValue[] | undefined): readonly Key[] | undefined => {
    if (value === undefined) {
        return undefined;
    }

    return value;
};

export const fromMultiValue = (keys: Key[]): TSelectValue[] => keys as TSelectValue[];

/** True when click originated from tag / remove / nested button chrome. */
export const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return Boolean(target.closest('[role="row"], [slot="remove"], button'));
};

/** Normalize RAC select value to a key list for tag remove / clear. */
export const toKeyList = (value: unknown): Key[] => (Array.isArray(value) ? value : []);
