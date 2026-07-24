import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Select } from './Component';
import { type IFormSelectProps, type TSelectValue } from './types';

type TFormSelectControlProps = Omit<ComponentProps<typeof Select>, 'size' | 'invalid' | 'disabled'>;

const FormSelectControl = (props: TFormSelectControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Select {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormSelect = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
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
            invalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            block={block}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormSelectControl
                {...selectProps}
                block={block}
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
