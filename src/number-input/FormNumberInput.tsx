import { type Ref } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { NumberInput } from './Component.js';
import { type IFormNumberInputProps, type INumberInputProps } from './types.js';

type TFormNumberInputControlProps = Omit<
    INumberInputProps,
    'size' | 'isInvalid' | 'disabled' | 'value' | 'onChange'
> & {
    value: number | null;
    onChange: (value: number | null) => void;
    ref?: Ref<HTMLInputElement>;
};

const FormNumberInputControl = ({ ref, value, onChange, onBlur, ...props }: TFormNumberInputControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return (
        <NumberInput
            {...controlProps}
            {...props}
            ref={ref}
            size={size}
            isInvalid={isInvalid}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

FormNumberInputControl.displayName = 'FormNumberInputControl';

const toViewValue = (store: unknown, transform: IFormNumberInputProps['transform']): number | null => {
    if (transform) {
        return transform.format(store as number | null | undefined);
    }

    if (store == null || store === '') {
        return null;
    }

    const numeric = typeof store === 'number' ? store : Number(store);

    return Number.isNaN(numeric) ? null : numeric;
};

export const FormNumberInput = ({
    name,
    label,
    hint,
    size = 'md',
    disabled,
    className,
    dataTestId,
    transform,
    ...inputProps
}: IFormNumberInputProps) => {
    const { field, fieldState, inputProps: rhfInputProps, setFieldValue, onBlurHandler } = useFieldHook({ name });
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? rhfInputProps.disabled;
    const viewValue = toViewValue(field.value, transform);

    return (
        <Field
            isInvalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormNumberInputControl
                {...inputProps}
                name={rhfInputProps.name}
                ref={field.ref}
                value={viewValue}
                onChange={view => {
                    const store = transform ? transform.parse(view) : view;
                    setFieldValue(store);
                }}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormNumberInput.displayName = 'FormNumberInput';
