import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { ColorPicker } from './Component';
import { type IColorPickerProps, type IFormColorPickerProps } from './types';

type TFormColorPickerControlProps = Omit<IColorPickerProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: string;
    onChange: (value: string) => void;
};

const FormColorPickerControl = ({ value, onChange, onBlur, ...props }: TFormColorPickerControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return (
        <ColorPicker
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

FormColorPickerControl.displayName = 'FormColorPickerControl';

export const FormColorPicker = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormColorPickerProps) => {
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
            <FormColorPickerControl
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

FormColorPicker.displayName = 'FormColorPicker';
