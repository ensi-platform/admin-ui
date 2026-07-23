import cn from 'classnames';
import { Label } from 'react-aria-components';

import { useField } from '../../context.js';
import { type IFieldLabelProps } from '../../types.js';

import { fieldLabelVariants } from './theme.js';

export const FieldLabel = ({ children, className, ...props }: IFieldLabelProps) => {
    const { id, labelId, size, disabled } = useField();

    return (
        <Label
            {...props}
            id={labelId}
            htmlFor={id}
            className={cn(fieldLabelVariants({ size, disabled: Boolean(disabled) }), className)}
        >
            {children}
        </Label>
    );
};

FieldLabel.displayName = 'Field.Label';
