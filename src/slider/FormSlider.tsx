import { type Ref } from 'react';

import { supportRef } from '@ds/common/support-ref';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Slider } from './Component';
import { type IFormSliderProps, type ISliderProps } from './types';

type TFormSliderControlProps = Omit<ISliderProps, 'size' | 'invalid' | 'disabled' | 'value' | 'onChange'> & {
    value: number;
    onChange: (value: number) => void;
    ref?: Ref<HTMLInputElement>;
};

const FormSliderControl = supportRef(
    ({ ref, value, onChange, 'aria-label': ariaLabel, ...props }: TFormSliderControlProps) => {
        const { controlProps, size, invalid, disabled } = useField();
        const {
            id,
            'aria-describedby': ariaDescribedby,
            'aria-invalid': ariaInvalid,
            'aria-labelledby': ariaLabelledby,
        } = controlProps;

        return (
            <Slider
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
                value={value}
                onChange={onChange}
            />
        );
    }
);
FormSliderControl.displayName = 'FormSliderControl';

export const FormSlider = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    minValue = 0,
    ...sliderProps
}: IFormSliderProps) => {
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
            <FormSliderControl
                {...sliderProps}
                block={block}
                minValue={minValue}
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

FormSlider.displayName = 'FormSlider';
