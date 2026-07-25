import { type Ref } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { NumberInput } from './Component';
import { type IFormNumberInputProps, type INumberInputProps } from './types';

type TFormNumberInputControlProps = Omit<INumberInputProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: number | null;
    onChange: (value: number | null) => void;
    ref?: Ref<HTMLInputElement>;
};

const FormNumberInputControl = ({ ref, value, onChange, onBlur, ...props }: TFormNumberInputControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <NumberInput
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

FormNumberInputControl.displayName = 'FormNumberInputControl';

export const FormNumberInput = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormNumberInputProps) => {
    const { field, fieldState, inputProps: rhfInputProps, setFieldValue, onBlurHandler } = useFieldHook({ name });
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
            <FormNumberInputControl
                {...inputProps}
                block={block}
                name={rhfInputProps.name}
                ref={field.ref}
                value={field.value ?? null}
                onChange={view => {
                    setFieldValue(view);
                }}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormNumberInput.displayName = 'FormNumberInput';
