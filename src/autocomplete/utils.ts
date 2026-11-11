import { type Key } from 'react-aria-components';

import { type TComboboxValue } from '@/combobox/types';

export const toSelectedKey = (value: TComboboxValue | null | undefined): Key | null | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (value === null || value === '') {
        return null;
    }

    return value;
};
