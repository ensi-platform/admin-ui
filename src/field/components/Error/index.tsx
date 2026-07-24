import cn from 'classnames';

import { useField } from '@/field/context';

import { fieldErrorVariants } from './theme';
import { type IFieldErrorProps } from './types';

export const FieldError = ({ children, className, ...props }: IFieldErrorProps) => {
    const { errorId, invalid, size } = useField();

    if (!children || !invalid) {
        return null;
    }

    return (
        <span {...props} id={errorId} role="alert" className={cn(fieldErrorVariants({ size }), className)}>
            {children}
        </span>
    );
};

FieldError.displayName = 'Field.Error';
