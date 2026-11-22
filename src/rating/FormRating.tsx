import { type Ref } from 'react';

import { supportRef } from '@ds/common/support-ref';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Rating } from './Component';
import { type IFormRatingProps, type IRatingProps } from './types';

type TFormRatingControlProps = Omit<IRatingProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: number;
    onChange: (value: number) => void;
    ref?: Ref<HTMLInputElement>;
};

const FormRatingControl = supportRef(
    ({ ref, value, onChange, readOnly, 'aria-label': ariaLabel, ...props }: TFormRatingControlProps) => {
        const { controlProps, size, invalid, disabled } = useField();
        const {
            id,
            'aria-describedby': ariaDescribedby,
            'aria-invalid': ariaInvalid,
            'aria-labelledby': ariaLabelledby,
        } = controlProps;

        return (
            <Rating
                {...props}
                ref={ref}
                id={id}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabel ? undefined : ariaLabelledby}
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
                size={size}
                invalid={invalid}
                disabled={disabled}
                readOnly={readOnly}
                value={value}
                onChange={onChange}
            />
        );
    }
);
FormRatingControl.displayName = 'FormRatingControl';

export const FormRating = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    readOnly,
    className,
    dataTestId,
    minValue = 0,
    ...ratingProps
}: IFormRatingProps) => {
    const { field, fieldState, inputProps, setFieldValue, onBlurHandler } = useFieldHook({ name });
    const error = getError(fieldState.error)?.message;
    const isDisabled = disabled ?? inputProps.disabled;
    const value = typeof field.value === 'number' ? field.value : minValue;

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
            <FormRatingControl
                {...ratingProps}
                minValue={minValue}
                readOnly={readOnly || inputProps.readOnly}
                ref={field.ref}
                value={value}
                onChange={next => setFieldValue(next)}
                onBlur={() => onBlurHandler()}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormRating.displayName = 'FormRating';
