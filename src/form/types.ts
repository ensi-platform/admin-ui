import { type HTMLProps, type ReactNode } from 'react';

import {
    type ControllerRenderProps,
    type DefaultValues,
    type FieldErrors,
    type FieldValues,
    type NativeFieldValue,
    type Path,
    type UseFormProps,
    type UseFormReturn,
} from 'react-hook-form';
import { type ZodType } from 'zod';

type TExtendedValue<T> = T | T[] | Record<string, T> | Record<string, T>[];

export type TFieldValueType = Exclude<TExtendedValue<NativeFieldValue>, undefined>;

export interface IControllerRenderProps<T extends TFieldValueType> extends Omit<ControllerRenderProps, 'value'> {
    value: T;
}

export type { FieldValues, Path };

export interface IFormFieldComponent<
    TFieldValues extends FieldValues = FieldValues,
    TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
    /** Имя поля в форме. */
    name: TName;
}

export type TFormSubmitHandler<T extends FieldValues> = (
    values: T,
    formProps: UseFormReturn<T, unknown>
) => void | Promise<void>;

export type TFormChangeHandler<T extends FieldValues> = (
    values: T,
    formProps: UseFormReturn<T, unknown>,
    exactChange: Record<string, unknown>
) => void | Promise<unknown>;

export type TFormBlurHandler<T extends FieldValues> = (
    values: T,
    formProps: UseFormReturn<T, unknown>,
    exactChange: Record<string, unknown>
) => void | Promise<unknown>;

export type TFormExactChange<T extends FieldValues> = Parameters<TFormChangeHandler<T>>[2];

type TFormActionProps<T extends FieldValues> =
    | { onSubmit: TFormSubmitHandler<T>; onChange?: TFormChangeHandler<T> }
    | { onChange: TFormChangeHandler<T>; onSubmit?: TFormSubmitHandler<T> };

export interface IFormBaseProps<T extends FieldValues>
    extends
        Omit<UseFormProps<T>, 'children'>,
        Omit<
            HTMLProps<HTMLFormElement>,
            'onSubmit' | 'ref' | 'onReset' | 'children' | 'onChange' | 'onError' | 'onBlur'
        > {
    /** Начальные значения полей. */
    initialValues: DefaultValues<T>;
    /** Zod-схема валидации. */
    validationSchema?: ZodType<Partial<T>, FieldValues>;
    /** Содержимое формы или render-prop с RHF API. */
    children?: ReactNode | ((props: UseFormReturn<T, unknown>) => ReactNode);
    /**
     * Сбрасывать форму при изменении `initialValues`.
     * @default false
     */
    enableReinitialize?: boolean;
    /**
     * Рендерить нативный `<form>`.
     * @default true
     */
    isForm?: boolean;
    /**
     * Disabled для полей через FormContext.
     * @default false
     */
    disabled?: boolean;
    /** После reinitialize вызвать `form.trigger()`. */
    triggerOnReinitialize?: boolean;
    /** Обработчик reset. */
    onReset?: (values: T, formProps: UseFormReturn<T, unknown>) => void | Promise<void>;
    /** Form-level onBlur. */
    onBlur?: TFormBlurHandler<T>;
    /** Обработчик ошибок валидации при submit. */
    onError?: (error: FieldErrors<T>, formProps: UseFormReturn<T, unknown>) => void | Promise<unknown>;
}

/** Пропы Form: обязателен `onSubmit` и/или `onChange`. */
export type TFormProps<T extends FieldValues> = IFormBaseProps<T> & TFormActionProps<T>;
