import { type Ref } from 'react';

import { type DateValue } from '@internationalized/date';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { DatePicker } from './Component';
import { type IDatePickerProps, type IFormDatePickerProps } from './types';

type TFormDatePickerControlProps = Omit<IDatePickerProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: DateValue | null;
    onChange: (value: DateValue | null) => void;
    ref?: Ref<HTMLDivElement>;
};

const FormDatePickerControl = ({ ref, value, onChange, onBlur, ...props }: TFormDatePickerControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <DatePicker
            {...controlProps}
            {...props}
            ref={ref}
            size={size}
            invalid={invalid}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

FormDatePickerControl.displayName = 'FormDatePickerControl';

export const FormDatePicker = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormDatePickerProps) => {
    const { field, fieldState, inputProps: rhfInputProps, onChange, onBlurHandler } = useFieldHook({ name });
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? rhfInputProps.disabled;

    return (
        <Field
            invalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            block={block}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormDatePickerControl
                {...inputProps}
                block={block}
                ref={field.ref}
                value={field.value ?? null}
                onChange={next => {
                    field.onChange(next);
                    onChange(name, next as never);
                }}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormDatePicker.displayName = 'FormDatePicker';
