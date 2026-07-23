import { type ComponentProps } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { TextArea } from './Component.js';
import { type IFormTextAreaProps } from './types.js';

type TFormTextAreaControlProps = Omit<ComponentProps<typeof TextArea>, 'size' | 'isInvalid' | 'disabled'>;

const FormTextAreaControl = (props: TFormTextAreaControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <TextArea {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} {...props} />;
};

export const FormTextArea = ({
    name,
    label,
    hint,
    size = 'md',
    disabled,
    className,
    dataTestId,
    ...textAreaProps
}: IFormTextAreaProps) => {
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
            <FormTextAreaControl
                {...textAreaProps}
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

FormTextArea.displayName = 'FormTextArea';
