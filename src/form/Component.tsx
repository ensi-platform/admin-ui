import { type BaseSyntheticEvent, useCallback, useEffect, useMemo, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import deepEqual from 'react-fast-compare';
import { type FieldValues, FormProvider, type NativeFieldValue, type Resolver, useForm } from 'react-hook-form';

import { usePrevious } from '../hooks/index.js';

import { FormContext } from './context.js';
import { type TFormProps } from './types.js';

export const Form = <T extends FieldValues>({
    id,
    initialValues,
    validationSchema,
    children: childrenProp,
    mode = 'all',
    isForm = true,
    enableReinitialize = false,
    triggerOnReinitialize = false,
    disabled = false,
    onSubmit,
    onError,
    onReset,
    onChange,
    onBlur,
    className,
    ...props
}: TFormProps<T>) => {
    const form = useForm<T>({
        defaultValues: initialValues,
        mode,
        ...(validationSchema && { resolver: zodResolver(validationSchema) as Resolver<T> }),
        ...props,
    });

    const reset: typeof form.reset = useCallback(
        (newValues, keepStateOptions) => {
            form.reset(newValues, keepStateOptions);
            const values = form.getValues();
            if (onReset) onReset(values, form);
        },
        [form, onReset]
    );

    const children: typeof childrenProp = useMemo(
        () => (typeof childrenProp === 'function' ? childrenProp({ ...form, reset }) : childrenProp),
        [childrenProp, form, reset]
    );

    const prevInitialValues = usePrevious(initialValues);

    useEffect(() => {
        if (enableReinitialize && !deepEqual(prevInitialValues, initialValues)) {
            form.reset(initialValues);
            if (triggerOnReinitialize) form.trigger();
        }
    }, [enableReinitialize, initialValues, form, prevInitialValues, triggerOnReinitialize]);

    const onChangeHandler = useCallback(
        (key: string, value: NativeFieldValue) => {
            if (onChange) onChange(form.getValues(), form, { [key]: value });
        },
        [form, onChange]
    );

    const formHandlerRef = useRef<(e?: BaseSyntheticEvent) => Promise<void> | null>(null);
    formHandlerRef.current = form.handleSubmit(
        async v => {
            await onSubmit?.(v, form);
        },
        async errors => {
            await onError?.(errors, form);
        }
    );

    const onSubmitHandler = useCallback((e?: BaseSyntheticEvent) => {
        if (formHandlerRef.current) {
            e?.stopPropagation();
            formHandlerRef.current(e);
        }
    }, []);

    const onBlurHandler = useCallback(
        (key: string, value: NativeFieldValue) => {
            if (onBlur) onBlur(form.getValues(), form, { [key]: value });
        },
        [form, onBlur]
    );

    const providerValue = useMemo(
        () => ({ onChange: onChangeHandler, onBlur: onBlurHandler, disabled, onSubmitHandler }),
        [onChangeHandler, onBlurHandler, disabled, onSubmitHandler]
    );

    return (
        <FormProvider {...form} reset={reset}>
            <FormContext.Provider value={providerValue}>
                {isForm ? (
                    <form className={className} id={id} noValidate onSubmit={onSubmitHandler}>
                        {children}
                    </form>
                ) : (
                    <div className={className}>{children}</div>
                )}
            </FormContext.Provider>
        </FormProvider>
    );
};
