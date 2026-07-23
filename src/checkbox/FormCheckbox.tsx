import { type ComponentProps } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { Checkbox } from './Component.js';
import { type IFormCheckboxProps } from './types.js';

type TFormCheckboxControlProps = Omit<ComponentProps<typeof Checkbox>, 'size' | 'isInvalid' | 'disabled'>;

const FormCheckboxControl = (props: TFormCheckboxControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();
    const { id, 'aria-describedby': ariaDescribedby, 'aria-invalid': ariaInvalid } = controlProps;

    return (
        <Checkbox
            id={id}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
            size={size}
            isInvalid={isInvalid}
            disabled={disabled}
            {...props}
        />
    );
};

export const FormCheckbox = ({
    name,
    hint,
    size = 'md',
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
            isInvalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
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
