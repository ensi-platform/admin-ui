import { type ComponentProps } from 'react';

import { Field, useField } from '../field/index.js';
import { useFieldHook } from '../form/hooks/useFieldHook.js';
import { getError } from '../form/utils.js';

import { Switch } from './Component.js';
import { type IFormSwitchProps } from './types.js';

type TFormSwitchControlProps = Omit<ComponentProps<typeof Switch>, 'size' | 'isInvalid' | 'disabled'>;

const FormSwitchControl = (props: TFormSwitchControlProps) => {
    const { controlProps, size, isInvalid, disabled } = useField();
    const { id, 'aria-describedby': ariaDescribedby, 'aria-invalid': ariaInvalid } = controlProps;

    return (
        <Switch
            id={id}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
            size={size}
            isInvalid={isInvalid}
            disabled={disabled}
            {...props}
        />
    );
};

export const FormSwitch = ({
    name,
    hint,
    size = 'md',
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
            isInvalid={Boolean(error)}
            disabled={isDisabled}
            size={size}
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
