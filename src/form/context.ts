import { type BaseSyntheticEvent, createContext, useContext } from 'react';

import { type NativeFieldValue } from 'react-hook-form';

export interface IFormContextValue {
    onChange: (key: string, value: NativeFieldValue) => void;
    onBlur: (key: string, value: NativeFieldValue) => void;
    onSubmitHandler: (event?: BaseSyntheticEvent) => void;
    disabled?: boolean;
}

export const FormContext = createContext<IFormContextValue | undefined>(undefined);

export const useAuiForm = (): IFormContextValue => {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error('This component must be used within a <Form> component');
    }

    return context;
};
