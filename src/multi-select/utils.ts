import { type Key } from 'react-aria-components';

import { type TSelectValue } from '../select/types.js';

export const toMultiValue = (value: TSelectValue[] | undefined): readonly Key[] | undefined => {
    if (value === undefined) {
        return undefined;
    }

    return value;
};

export const fromMultiValue = (keys: Key[]): TSelectValue[] => keys as TSelectValue[];
