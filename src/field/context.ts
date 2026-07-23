import { createContext, useContext } from 'react';

import { type IFieldContextValue } from './types.js';

export const FieldContext = createContext<IFieldContextValue | undefined>(undefined);

export const useField = (): IFieldContextValue => {
    const context = useContext(FieldContext);

    if (!context) {
        throw new Error('This component must be used within a <Field> component');
    }

    return context;
};
