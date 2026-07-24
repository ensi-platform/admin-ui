import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { CheckboxGroup } from './Component';
import { type IFormCheckboxGroupProps } from './types';

type TFormCheckboxGroupControlProps = Omit<ComponentProps<typeof CheckboxGroup>, 'size' | 'invalid' | 'disabled'>;

const FormCheckboxGroupControl = (props: TFormCheckboxGroupControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <CheckboxGroup {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormCheckboxGroup = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
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
            invalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            block={block}
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
