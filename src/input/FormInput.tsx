import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Input } from './Component';
import { type IFormInputProps } from './types';

type TFormInputControlProps = Omit<ComponentProps<typeof Input>, 'size' | 'invalid' | 'disabled'>;

const FormInputControl = (props: TFormInputControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Input {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormInput = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
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
            invalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            block={block}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormInputControl
                {...inputProps}
                {...rhfInputProps}
                block={block}
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
