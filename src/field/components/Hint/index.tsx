import cn from 'classnames';
import { Text } from 'react-aria-components';

import { useField } from '@/field/context';

import { fieldHintVariants } from './theme';
import { type IFieldHintProps } from './types';

export const FieldHint = ({ children, className, ...props }: IFieldHintProps) => {
    const { hintId, size, disabled } = useField();

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
