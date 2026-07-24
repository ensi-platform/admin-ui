import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { TextArea } from './Component';
import { type IFormTextAreaProps } from './types';

type TFormTextAreaControlProps = Omit<ComponentProps<typeof TextArea>, 'size' | 'invalid' | 'disabled'>;

const FormTextAreaControl = (props: TFormTextAreaControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <TextArea {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormTextArea = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
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
            invalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            block={block}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormTextAreaControl
                {...textAreaProps}
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

FormTextArea.displayName = 'FormTextArea';
