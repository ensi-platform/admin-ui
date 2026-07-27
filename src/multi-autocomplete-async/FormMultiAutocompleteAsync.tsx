import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';
import { type TSelectValue } from '@/select/types';

import { MultiAutocompleteAsync } from './Component';
import { type IFormMultiAutocompleteAsyncProps } from './types';

type TFormMultiAutocompleteAsyncControlProps = Omit<
    ComponentProps<typeof MultiAutocompleteAsync>,
    'size' | 'invalid' | 'disabled'
>;

const FormMultiAutocompleteAsyncControl = (props: TFormMultiAutocompleteAsyncControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <MultiAutocompleteAsync {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

export const FormMultiAutocompleteAsync = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    ...autocompleteProps
}: IFormMultiAutocompleteAsyncProps) => {
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
            <FormMultiAutocompleteAsyncControl
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

FormMultiAutocompleteAsync.displayName = 'FormMultiAutocompleteAsync';
