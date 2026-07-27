import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';
import { type TSelectValue } from '@/select/types';

import { AutocompleteAsync } from './Component';
import { type IFormAutocompleteAsyncProps } from './types';

type TFormAutocompleteAsyncControlProps = Omit<
    ComponentProps<typeof AutocompleteAsync>,
    'size' | 'invalid' | 'disabled'
>;

const FormAutocompleteAsyncControl = (props: TFormAutocompleteAsyncControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <AutocompleteAsync {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormAutocompleteAsync = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...autocompleteProps
}: IFormAutocompleteAsyncProps) => {
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
            <FormAutocompleteAsyncControl
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

FormAutocompleteAsync.displayName = 'FormAutocompleteAsync';
