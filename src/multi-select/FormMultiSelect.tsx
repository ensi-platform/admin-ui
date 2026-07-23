import { type ComponentProps } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { MultiSelect } from './Component.js';
import { type IFormMultiSelectProps, type TSelectValue } from './types.js';

type TFormMultiSelectControlProps = Omit<ComponentProps<typeof MultiSelect>, 'size' | 'isInvalid' | 'disabled'>;

const FormMultiSelectControl = (props: TFormMultiSelectControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <MultiSelect {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} {...props} />;
};

export const FormMultiSelect = ({
    name,
    label,
    hint,
    size = 'md',
    disabled,
    className,
    dataTestId,
    ...selectProps
}: IFormMultiSelectProps) => {
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
            <FormMultiSelectControl
                {...selectProps}
                name={inputProps.name}
                value={(field.value as TSelectValue[] | undefined) ?? []}
                onChange={next => setFieldValue(next)}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormMultiSelect.displayName = 'FormMultiSelect';
