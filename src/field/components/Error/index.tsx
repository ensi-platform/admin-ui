import cn from 'classnames';

import { useField } from '../../context.js';
import { type IFieldErrorProps } from '../../types.js';

import { fieldErrorVariants } from './theme.js';

export const FieldError = ({ children, className, ...props }: IFieldErrorProps) => {
    const { errorId, isInvalid, size } = useField();

    if (!children || !isInvalid) {
        return null;
    }

    return (
        <span {...props} id={errorId} role="alert" className={cn(fieldErrorVariants({ size }), className)}>
            {children}
        </span>
    );
};

FieldError.displayName = 'Field.Error';
