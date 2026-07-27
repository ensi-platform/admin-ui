import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { MultiSelect } from './Component';
import { type IFormMultiSelectProps, type TComboboxValue } from './types';

type TFormMultiSelectControlProps = Omit<ComponentProps<typeof MultiSelect>, 'size' | 'invalid' | 'disabled'>;

const FormMultiSelectControl = (props: TFormMultiSelectControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <MultiSelect {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormMultiSelect = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
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
            invalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            block={block}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormMultiSelectControl
                {...selectProps}
                block={block}
                name={inputProps.name}
                value={(field.value as TComboboxValue[] | undefined) ?? []}
                onChange={next => setFieldValue(next)}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormMultiSelect.displayName = 'FormMultiSelect';
