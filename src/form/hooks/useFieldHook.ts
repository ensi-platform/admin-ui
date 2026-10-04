import { type FocusEvent, type SyntheticEvent, useCallback } from 'react';

import { type NativeFieldValue, useController, useFormContext } from 'react-hook-form';

import { useAuiForm } from '../context';
import { type IFormFieldComponent } from '../types';
import { resolveFieldFlag } from '../utils';

/** Builds controlled field wiring by `name` for FormInput / FormSelect / …. */
export const useFieldHook = <TElement extends HTMLElement = HTMLElement>({ name }: IFormFieldComponent) => {
    const { onChange, onBlur: onFormBlur, disabled, readOnly } = useAuiForm();
    const { control, setValue } = useFormContext();

    const { field, fieldState } = useController({
        name,
        control,
    });

    const onBlurHandler = useCallback(
        (e?: FocusEvent<TElement>) => {
            field.onBlur();
            const target = e?.currentTarget;
            const value = target && 'value' in target && typeof target.value === 'string' ? target.value : field.value;
            onFormBlur(name, value);
        },
        [field, name, onFormBlur]
    );

    const inputProps = {
        name,
        onBlur: onBlurHandler,
        disabled: resolveFieldFlag(disabled, name),
        readOnly: resolveFieldFlag(readOnly, name) || undefined,
    };

    const setFieldValue = useCallback(
        (value: NativeFieldValue) => {
            field.onChange(value);
            onChange(name, value);
        },
        [field, name, onChange]
    );

    const onChangeHandler = useCallback(
        <T extends HTMLInputElement | HTMLTextAreaElement, E extends Event>(
            e?: SyntheticEvent<T, E>,
            val?: NativeFieldValue
        ) => {
            if (val !== undefined) {
                setFieldValue(val);
                return;
            }

            if (!e) {
                return;
            }

            field.onChange(e);
            const target = e.currentTarget;
            const { value } = target as HTMLInputElement | HTMLTextAreaElement;
            onChange(name, value);
        },
        [field, name, onChange, setFieldValue]
    );

    return { field, onChange, setValue, fieldState, inputProps, setFieldValue, onChangeHandler, onBlurHandler };
};
