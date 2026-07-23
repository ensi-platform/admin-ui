import { type ComponentProps } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { CheckboxGroup } from './Component.js';
import { type IFormCheckboxGroupProps } from './types.js';

type TFormCheckboxGroupControlProps = Omit<ComponentProps<typeof CheckboxGroup>, 'size' | 'isInvalid' | 'disabled'>;

const FormCheckboxGroupControl = (props: TFormCheckboxGroupControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <CheckboxGroup {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} {...props} />;
};

export const FormCheckboxGroup = ({
    name,
    label,
    hint,
    size = 'md',
    disabled,
    className,
    dataTestId,
    children,
    ...groupProps
}: IFormCheckboxGroupProps) => {
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
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormCheckboxGroupControl
                {...groupProps}
                name={inputProps.name}
                ref={field.ref}
                value={(field.value as string[] | undefined) ?? []}
                onChange={next => setFieldValue(next)}
                onBlur={() => onBlurHandler()}
            >
                {children}
            </FormCheckboxGroupControl>
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormCheckboxGroup.displayName = 'FormCheckboxGroup';
