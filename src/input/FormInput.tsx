import { type ComponentProps } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { Input } from './Component.js';
import { type IFormInputProps } from './types.js';

type TFormInputControlProps = Omit<ComponentProps<typeof Input>, 'size' | 'isInvalid' | 'disabled'>;

const FormInputControl = (props: TFormInputControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <Input {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} {...props} />;
};

export const FormInput = ({
    name,
    label,
    hint,
    size = 'md',
    disabled,
    className,
    dataTestId,
    ...inputProps
}: IFormInputProps) => {
    const { field, fieldState, inputProps: rhfInputProps, onChangeHandler, onBlurHandler } = useFieldHook({ name });
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? rhfInputProps.disabled;

    return (
        <Field
            isInvalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormInputControl
                {...inputProps}
                {...rhfInputProps}
                ref={field.ref}
                value={field.value ?? ''}
                onChange={e => onChangeHandler(e)}
                onBlur={e => onBlurHandler(e)}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormInput.displayName = 'FormInput';
