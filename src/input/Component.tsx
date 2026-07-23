import cn from 'classnames';
import { Input as RacInput } from 'react-aria-components';

import { inputVariants } from './theme.js';
import { type IInputProps } from './types.js';

export const Input = ({
    ref,
    size = 'md',
    isInvalid = false,
    disabled = false,
    className,
    dataTestId,
    ...props
}: IInputProps) => (
    <RacInput
        {...props}
        ref={ref}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        data-invalid={isInvalid || undefined}
        data-test-id={dataTestId}
        className={cn(inputVariants({ size }), className)}
    />
);

Input.displayName = 'Input';
