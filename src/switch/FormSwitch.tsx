import { type ComponentProps } from 'react';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';

import { Switch } from './Component';
import { type IFormSwitchProps } from './types';

type TFormSwitchControlProps = Omit<ComponentProps<typeof Switch>, 'size' | 'invalid' | 'disabled'>;

const FormSwitchControl = (props: TFormSwitchControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();
    const { id, 'aria-describedby': ariaDescribedby, 'aria-invalid': ariaInvalid } = controlProps;

    return (
        <Switch
            id={id}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
            size={size}
            invalid={invalid}
            disabled={disabled}
            {...props}
        />
    );
};

export const FormSwitch = ({
    name,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    children,
    ...switchProps
}: IFormSwitchProps) => {
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
            <FormSwitchControl
                {...switchProps}
                name={inputProps.name}
                ref={field.ref}
                checked={Boolean(field.value)}
                onChange={next => setFieldValue(next)}
                onBlur={() => onBlurHandler()}
            >
                {children}
            </FormSwitchControl>
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{error}</Field.Error>
        </Field>
    );
};

FormSwitch.displayName = 'FormSwitch';
