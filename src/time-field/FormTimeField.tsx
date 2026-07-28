import { type Ref } from 'react';

import { type TimeValue } from 'react-aria-components';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { TimeField } from './Component';
import { type IFormTimeFieldProps, type ITimeFieldProps } from './types';

type TFormTimeFieldControlProps = Omit<ITimeFieldProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: TimeValue | null;
    onChange: (value: TimeValue | null) => void;
    ref?: Ref<HTMLDivElement>;
};

const FormTimeFieldControl = ({ ref, value, onChange, onBlur, ...props }: TFormTimeFieldControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <TimeField
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

FormTimeFieldControl.displayName = 'FormTimeFieldControl';

export const FormTimeField = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormTimeFieldProps) => {
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
            <FormTimeFieldControl
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

FormTimeField.displayName = 'FormTimeField';
