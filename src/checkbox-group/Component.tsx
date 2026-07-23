import cn from 'classnames';
import { CheckboxGroup as RacCheckboxGroup } from 'react-aria-components';

import { type ICheckboxGroupProps } from './types.js';

import styles from './styles.module.css';

export const CheckboxGroup = ({
    ref,
    value,
    defaultValue,
    onChange,
    children,
    size = 'md',
    isInvalid = false,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ICheckboxGroupProps) => (
    <RacCheckboxGroup
        {...props}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        isDisabled={disabled}
        isInvalid={isInvalid}
        data-invalid={isInvalid || undefined}
        data-size={size}
        data-test-id={dataTestId}
        className={cn(styles.root, className)}
    >
        {children}
    </RacCheckboxGroup>
);

CheckboxGroup.displayName = 'CheckboxGroup';
