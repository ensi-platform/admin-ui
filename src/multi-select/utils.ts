import { type Key } from 'react-aria-components';

import { type TComboboxValue } from '@/combobox/types';

export const toMultiValue = (value: TComboboxValue[] | undefined): readonly Key[] | undefined => {
    if (value === undefined) {
        return undefined;
    }

    return value;
};

export const fromMultiValue = (keys: Key[]): TComboboxValue[] => keys as TComboboxValue[];
