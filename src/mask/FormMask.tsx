import { type ComponentProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Mask } from './Component';
import { type IFormMaskProps } from './types';

type TFormMaskControlProps = Omit<ComponentProps<typeof Mask>, 'size' | 'invalid' | 'disabled'>;

const FormMaskControl = supportRef((props: TFormMaskControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Mask {...props} {...controlProps} size={size} invalid={invalid} disabled={disabled} />;
});

export const FormMask = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    readOnly,
    className,
    dataTestId,
    ...maskProps
}: IFormMaskProps) => {
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
            <FormMaskControl
                {...maskProps}
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

FormMask.displayName = 'FormMask';
