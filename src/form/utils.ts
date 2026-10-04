import { type FieldError } from 'react-hook-form';

import { type TFormFieldFlag } from './types';

export const getError = (value?: FieldError) => (Array.isArray(value) ? value[0] : value);

/** Resolves a form-level boolean or a per-field map. Keys are exact RHF names. */
export const resolveFieldFlag = (flag: TFormFieldFlag | undefined, name: string): boolean => {
    if (typeof flag === 'boolean') {
        return flag;
    }

    if (flag == null) {
        return false;
    }

    return flag[name] ?? false;
};
