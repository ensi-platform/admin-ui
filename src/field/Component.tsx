import { useId, useMemo } from 'react';

import cn from 'classnames';

import { FieldError } from './components/Error';
import { FieldHint } from './components/Hint';
import { FieldLabel } from './components/Label';
import { FieldContext } from './context';
import { fieldVariants } from './theme';
import { type IFieldProps } from './types';

const FieldRoot = ({
    ref,
    children,
    invalid = false,
    disabled = false,
    size = 'md',
    block = true,
    className,
    dataTestId,
    ...props
}: IFieldProps) => {
    const reactId = useId();
    const id = `aui-field-${reactId}`;
    const labelId = `${id}-label`;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    const controlProps = useMemo(
        () => ({
            id,
            'aria-labelledby': labelId,
            'aria-describedby': [hintId, invalid ? errorId : null].filter(Boolean).join(' '),
            'aria-invalid': invalid || undefined,
            disabled: disabled || undefined,
        }),
        [id, labelId, hintId, errorId, invalid, disabled]
    );

    const value = useMemo(
        () => ({
            id,
            labelId,
            hintId,
            errorId,
            invalid,
            disabled,
            size,
            controlProps,
        }),
        [id, labelId, hintId, errorId, invalid, disabled, size, controlProps]
    );

    return (
        <FieldContext.Provider value={value}>
            <div
                {...props}
                ref={ref}
                className={cn(fieldVariants({ size, block }), className)}
                data-invalid={invalid || undefined}
                data-disabled={disabled || undefined}
                data-size={size}
                data-test-id={dataTestId}
            >
                {children}
            </div>
        </FieldContext.Provider>
    );
};

FieldRoot.displayName = 'Field';

export const Field = Object.assign(FieldRoot, {
    Label: FieldLabel,
    Hint: FieldHint,
    Error: FieldError,
});
