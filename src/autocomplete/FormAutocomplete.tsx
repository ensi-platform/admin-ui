import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Autocomplete } from './Component';
import { type IFormAutocompleteProps, type TSelectValue } from './types';

type TFormAutocompleteControlProps = Omit<ComponentProps<typeof Autocomplete>, 'size' | 'invalid' | 'disabled'>;

const FormAutocompleteControl = (props: TFormAutocompleteControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Autocomplete {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormAutocomplete = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...autocompleteProps
}: IFormAutocompleteProps) => {
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
            <FormAutocompleteControl
                {...autocompleteProps}
                block={block}
                name={inputProps.name}
                value={(field.value as TSelectValue | null | undefined) ?? null}
                onChange={next => setFieldValue(next ?? '')}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormAutocomplete.displayName = 'FormAutocomplete';
