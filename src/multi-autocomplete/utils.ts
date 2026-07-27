import { type Key } from 'react-aria-components';

import { type TComboboxValue } from '@/select/types';

export { isInteractiveTarget, resolveSelectedOptions, toKeyList } from '@/combobox';

export const toMultiValue = (value: TComboboxValue[] | undefined): Key[] | undefined => {
    if (value === undefined) {
        return undefined;
    }

    return [...value];
};

export const fromMultiValue = (keys: Key[]): TComboboxValue[] => keys as TComboboxValue[];
