import { type ComponentProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Password } from './Component';
import { type IFormPasswordProps } from './types';

type TFormPasswordControlProps = Omit<ComponentProps<typeof Password>, 'size' | 'invalid' | 'disabled'>;

const FormPasswordControl = supportRef((props: TFormPasswordControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Password {...props} {...controlProps} size={size} invalid={invalid} disabled={disabled} />;
});

export const FormPassword = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    readOnly,
    className,
    dataTestId,
    ...passwordProps
}: IFormPasswordProps) => {
    const { field, fieldState, inputProps: rhfInputProps, onChangeHandler, onBlurHandler } = useFieldHook({ name });
    const { disabled: formDisabled, readOnly: formReadOnly, ...restRhf } = rhfInputProps;
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? formDisabled;
    const isReadOnly = readOnly !== undefined ? readOnly : formReadOnly;

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
            <FormPasswordControl
                {...passwordProps}
                {...restRhf}
                readOnly={isReadOnly || undefined}
                block={block}
                ref={field.ref}
                value={field.value ?? ''}
                onChange={event => onChangeHandler(event)}
                onBlur={event => onBlurHandler(event)}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormPassword.displayName = 'FormPassword';
