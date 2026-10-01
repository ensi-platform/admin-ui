import cn from 'classnames';
import { CheckboxGroup as RacCheckboxGroup } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { type ICheckboxGroupProps } from './types';

import styles from './styles.module.css';

export const CheckboxGroup = supportRef(
    ({
        ref,
        value,
        defaultValue,
        onChange,
        children,
        size = 'md',
        invalid = false,
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
            isInvalid={invalid}
            data-invalid={invalid || undefined}
            data-size={size}
            data-test-id={dataTestId}
            className={cn(styles.root, className)}
        >
            {children}
        </RacCheckboxGroup>
    )
);

CheckboxGroup.displayName = 'CheckboxGroup';
