import { type ComponentProps } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { Select } from './Component.js';
import { type IFormSelectProps, type TSelectValue } from './types.js';

type TFormSelectControlProps = Omit<ComponentProps<typeof Select>, 'size' | 'isInvalid' | 'disabled'>;

const FormSelectControl = (props: TFormSelectControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <Select {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} {...props} />;
};

export const FormSelect = ({
    name,
    label,
    hint,
    size = 'md',
    disabled,
    className,
    dataTestId,
    ...selectProps
}: IFormSelectProps) => {
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
            <FormSelectControl
                {...selectProps}
                name={inputProps.name}
                value={(field.value as TSelectValue | null | undefined) ?? null}
                onChange={value => setFieldValue(value ?? '')}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormSelect.displayName = 'FormSelect';
