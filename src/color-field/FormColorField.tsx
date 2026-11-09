import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { ColorField } from './Component';
import { type IColorFieldProps, type IFormColorFieldProps } from './types';

type TFormColorFieldControlProps = Omit<IColorFieldProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: string;
    onChange: (value: string) => void;
};

const FormColorFieldControl = ({ value, onChange, onBlur, ...props }: TFormColorFieldControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <ColorField
            {...controlProps}
            {...props}
            size={size}
            invalid={invalid}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

FormColorFieldControl.displayName = 'FormColorFieldControl';

export const FormColorField = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormColorFieldProps) => {
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
            <FormColorFieldControl
                {...inputProps}
                block={block}
                inputRef={field.ref}
                value={typeof field.value === 'string' ? field.value : ''}
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

FormColorField.displayName = 'FormColorField';
