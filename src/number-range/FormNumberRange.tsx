import { type Ref } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { NumberRange } from './Component';
import { type IFormNumberRangeProps, type INumberRangeProps, type INumberRangeValue } from './types';

const EMPTY_RANGE: INumberRangeValue = { from: null, to: null };

type TFormNumberRangeControlProps = Omit<INumberRangeProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: INumberRangeValue;
    onChange: (value: INumberRangeValue) => void;
    ref?: Ref<HTMLDivElement>;
};

const FormNumberRangeControl = ({ ref, value, onChange, onBlur, ...props }: TFormNumberRangeControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <NumberRange
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

FormNumberRangeControl.displayName = 'FormNumberRangeControl';

export const FormNumberRange = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormNumberRangeProps) => {
    const { field, fieldState, inputProps: rhfInputProps, onChange, onBlurHandler } = useFieldHook({ name });
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? rhfInputProps.disabled;
    const value = (field.value as INumberRangeValue | null | undefined) ?? EMPTY_RANGE;

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
            <FormNumberRangeControl
                {...inputProps}
                block={block}
                ref={field.ref}
                value={value}
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

FormNumberRange.displayName = 'FormNumberRange';
