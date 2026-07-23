import cn from 'classnames';
import { Text } from 'react-aria-components';

import { useField } from '../../context.js';
import { type IFieldHintProps } from '../../types.js';

import { fieldHintVariants } from './theme.js';

export const FieldHint = ({ children, className, ...props }: IFieldHintProps) => {
    const { hintId, size, disabled } = useField();

    if (!children) {
        return null;
    }

    return (
        <Text
            {...props}
            id={hintId}
            slot="description"
            className={cn(fieldHintVariants({ size, disabled: Boolean(disabled) }), className)}
        >
            {children}
        </Text>
    );
};

FieldHint.displayName = 'Field.Hint';
