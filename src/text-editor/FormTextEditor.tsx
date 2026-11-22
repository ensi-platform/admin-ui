import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { TextEditor } from './Component';
import { type IFormTextEditorProps } from './types';

const FormTextEditorControl = ({
    ref,
    ...props
}: Omit<Parameters<typeof TextEditor>[0], 'size' | 'invalid' | 'disabled'>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <TextEditor {...props} {...controlProps} size={size} invalid={invalid} disabled={disabled} ref={ref} />;
};

export const FormTextEditor = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    readOnly,
    className,
    dataTestId,
    variant,
    ...contentProps
}: IFormTextEditorProps) => {
    const { field, fieldState, inputProps, setFieldValue } = useFieldHook({ name });
    const { disabled: formDisabled, readOnly: formReadOnly } = inputProps;
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? formDisabled;
    const isReadOnly = readOnly !== undefined ? readOnly : formReadOnly;
    const html = typeof field.value === 'string' ? field.value : '';

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
            <FormTextEditorControl
                {...contentProps}
                variant={variant}
                readOnly={isReadOnly || undefined}
                block={block}
                ref={field.ref}
                value={html}
                onChange={next => setFieldValue(next)}
                onBlur={() => field.onBlur()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormTextEditor.displayName = 'FormTextEditor';
