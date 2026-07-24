import { type ComponentProps } from 'react';

import { Field, useField, type IFieldContextValue } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Checkbox } from './Component';
import { type IFormCheckboxProps } from './types';

type TFormCheckboxControlProps = Omit<ComponentProps<typeof Checkbox>, keyof IFieldContextValue>;

const FormCheckboxControl = (props: TFormCheckboxControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();
    const { id, 'aria-describedby': ariaDescribedby, 'aria-invalid': ariaInvalid } = controlProps;

    return (
        <Checkbox
            id={id}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
            size={size}
            invalid={invalid}
            disabled={disabled}
            {...props}
        />
    );
};

export const FormCheckbox = ({
    name,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    children,
    ...checkboxProps
}: IFormCheckboxProps) => {
    const { field, fieldState, inputProps, setFieldValue, onBlurHandler } = useFieldHook({ name });
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? inputProps.disabled;

    return (
        <Field
            invalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            block={block}
            className={className}
            dataTestId={dataTestId}
        >
            <FormCheckboxControl
                {...checkboxProps}
                name={inputProps.name}
                ref={field.ref}
                checked={Boolean(field.value)}
                onChange={next => setFieldValue(next)}
                onBlur={() => onBlurHandler()}
            >
                {children}
            </FormCheckboxControl>
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormCheckbox.displayName = 'FormCheckbox';
