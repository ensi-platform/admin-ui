import { useId, useMemo } from 'react';

import cn from 'classnames';

import { FieldContext } from '../../context.js';
import { type IFieldProps } from '../../types.js';

import { fieldRootVariants } from './theme.js';

export const FieldRoot = ({
    ref,
    children,
    isInvalid = false,
    disabled = false,
    size = 'md',
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
            'aria-describedby': [hintId, isInvalid ? errorId : null].filter(Boolean).join(' '),
            'aria-invalid': isInvalid || undefined,
            disabled: disabled || undefined,
        }),
        [id, labelId, hintId, errorId, isInvalid, disabled]
    );

    const value = useMemo(
        () => ({
            id,
            labelId,
            hintId,
            errorId,
            isInvalid,
            disabled,
            size,
            controlProps,
        }),
        [id, labelId, hintId, errorId, isInvalid, disabled, size, controlProps]
    );

    return (
        <FieldContext.Provider value={value}>
            <div
                {...props}
                ref={ref}
                className={cn(fieldRootVariants({ size }), className)}
                data-invalid={isInvalid || undefined}
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
