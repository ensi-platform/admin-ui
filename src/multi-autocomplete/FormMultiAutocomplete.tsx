import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { MultiAutocomplete } from './Component';
import { type IFormMultiAutocompleteProps, type TSelectValue } from './types';

type TFormMultiAutocompleteControlProps = Omit<
    ComponentProps<typeof MultiAutocomplete>,
    'size' | 'invalid' | 'disabled'
>;

const FormMultiAutocompleteControl = (props: TFormMultiAutocompleteControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <MultiAutocomplete {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormMultiAutocomplete = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...autocompleteProps
}: IFormMultiAutocompleteProps) => {
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
            <FormMultiAutocompleteControl
                {...autocompleteProps}
                block={block}
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

FormMultiAutocomplete.displayName = 'FormMultiAutocomplete';
