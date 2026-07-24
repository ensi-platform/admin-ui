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
