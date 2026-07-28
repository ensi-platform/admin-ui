import { type Ref } from 'react';

import { type DateRange } from 'react-aria-components';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { DateRangePicker } from './Component';
import { type IDateRangePickerProps, type IFormDateRangePickerProps } from './types';

type TFormDateRangePickerControlProps = Omit<
    IDateRangePickerProps,
    'size' | 'invalid' | 'disabled' | 'value' | 'onChange'
> & {
    value: DateRange | null;
    onChange: (value: DateRange | null) => void;
    ref?: Ref<HTMLDivElement>;
};

const FormDateRangePickerControl = ({ ref, value, onChange, onBlur, ...props }: TFormDateRangePickerControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <DateRangePicker
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

FormDateRangePickerControl.displayName = 'FormDateRangePickerControl';

export const FormDateRangePicker = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormDateRangePickerProps) => {
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
            <FormDateRangePickerControl
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

FormDateRangePicker.displayName = 'FormDateRangePicker';
