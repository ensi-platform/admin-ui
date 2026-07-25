import { type Key } from 'react-aria-components';

import { type TSelectValue } from './types';

export const toSelectedKey = (value: TSelectValue | null | undefined): Key | null | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (value === null || value === '') {
        return null;
    }

    return value;
};

/** True when click originated from nested button chrome (clear / chevron). */
export const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return Boolean(target.closest('button'));
};
