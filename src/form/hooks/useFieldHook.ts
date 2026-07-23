import { type FocusEvent, type SyntheticEvent, useCallback } from 'react';

import { type NativeFieldValue, useController, useFormContext } from 'react-hook-form';

import { useAuiForm } from '../context.js';
import { type IFormFieldComponent } from '../types.js';

/** Готовит props controlled-поля по `name` для FormInput / FormSelect / …. */
export const useFieldHook = <TElement extends HTMLElement = HTMLElement>({ name }: IFormFieldComponent) => {
    const { onChange, onBlur: onFormBlur, disabled } = useAuiForm();
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
        disabled,
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
            e: SyntheticEvent<T, E> | undefined,
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
