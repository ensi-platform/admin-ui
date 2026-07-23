import cn from 'classnames';
import { TextArea as RacTextArea } from 'react-aria-components';

import { textAreaVariants } from './theme.js';
import { type ITextAreaProps } from './types.js';

export const TextArea = ({
    ref,
    size = 'md',
    isInvalid = false,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ITextAreaProps) => (
    <RacTextArea
        {...props}
        ref={ref}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        data-invalid={isInvalid || undefined}
        data-test-id={dataTestId}
        className={cn(textAreaVariants({ size }), className)}
    />
);

TextArea.displayName = 'TextArea';
