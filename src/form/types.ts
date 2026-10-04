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

import { type IFieldProps } from '@/field/types';

type TExtendedValue<T> = T | T[] | Record<string, T> | Record<string, T>[];

export type TFieldValueType = Exclude<TExtendedValue<NativeFieldValue>, undefined>;

export interface IControllerRenderProps<T extends TFieldValueType> extends Omit<ControllerRenderProps, 'value'> {
    value: T;
}

export type { FieldValues, Path };

/** Form-wide flag, or a map of exact RHF field names. */
export type TFormFieldFlag = boolean | Partial<Record<string, boolean>>;

/** Typed form-wide flag. Keys are exact `Path`s, not prefixes. */
export type TFormFieldFlags<T extends FieldValues> = boolean | Partial<Record<Path<T>, boolean>>;

export interface IFormFieldComponent<
    TFieldValues extends FieldValues = FieldValues,
    TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
    /** RHF field name. */
    name: TName;
}

/** Field shell props shared by Form* components. */
export interface IFormFieldShellProps extends Pick<
    IFieldProps,
    'size' | 'disabled' | 'block' | 'className' | 'dataTestId'
> {}

/** Label / hint slots for Form*. */
export interface IFormFieldMessagesProps {
    label?: ReactNode;
    hint?: ReactNode;
}

/** `name` + Field shell + messages — base for text-like Form*. */
export interface IFormFieldLayoutProps extends IFormFieldComponent, IFormFieldShellProps, IFormFieldMessagesProps {}

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
        Omit<UseFormProps<T>, 'children' | 'readOnly' | 'disabled'>,
        Omit<
            HTMLProps<HTMLFormElement>,
            'onSubmit' | 'ref' | 'onReset' | 'children' | 'onChange' | 'onError' | 'onBlur' | 'disabled' | 'readOnly'
        > {
    /** Initial field values. */
    initialValues: DefaultValues<T>;
    /** Zod validation schema. */
    validationSchema?: ZodType<Partial<T>, FieldValues>;
    /** Form children, or a render-prop with the RHF API. */
    children?: ReactNode | ((props: UseFormReturn<T, unknown>) => ReactNode);
    /**
     * Reset the form when `initialValues` change.
     * @default false
     */
    enableReinitialize?: boolean;
    /**
     * Render a native `<form>` element.
     * @default true
     */
    isForm?: boolean;
    /**
     * Disable fields through FormContext.
     * A map uses exact field names; a missing key means enabled.
     * A field prop wins over this value.
     * @default false
     */
    disabled?: TFormFieldFlags<T>;
    /**
     * Read-only fields through FormContext (`FormInput`, `FormTextArea`, `FormNumberInput`).
     * A map uses exact field names. Other controls stay on `disabled`.
     * A field prop wins over this value.
     * @default false
     */
    readOnly?: TFormFieldFlags<T>;
    /** Call `form.trigger()` after reinitialize. */
    triggerOnReinitialize?: boolean;
    /** Reset handler. */
    onReset?: (values: T, formProps: UseFormReturn<T, unknown>) => void | Promise<void>;
    /** Form-level blur handler. */
    onBlur?: TFormBlurHandler<T>;
    /** Validation error handler on submit. */
    onError?: (error: FieldErrors<T>, formProps: UseFormReturn<T, unknown>) => void | Promise<unknown>;
}

/** Form props. Requires `onSubmit` and/or `onChange`. */
export type TFormProps<T extends FieldValues> = IFormBaseProps<T> & TFormActionProps<T>;
