import cn from 'classnames';
import { CheckboxButton, CheckboxField } from 'react-aria-components';

import { Check } from '@/icons';

import { checkboxVariants } from './theme';
import { type ICheckboxProps } from './types';

import styles from './styles.module.css';

export const Checkbox = ({
    ref,
    size = 'md',
    variant = 'primary',
    checked,
    defaultChecked,
    onChange,
    indeterminate = false,
    value,
    children,
    invalid = false,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ICheckboxProps) => (
    <CheckboxField
        {...props}
        value={value}
        isSelected={checked}
        defaultSelected={defaultChecked}
        onChange={onChange}
        isIndeterminate={indeterminate}
        isDisabled={disabled}
        isInvalid={invalid}
    >
        <CheckboxButton
            ref={ref}
            data-invalid={invalid || undefined}
            data-test-id={dataTestId}
            className={cn(checkboxVariants({ size, variant }), className)}
        >
            <span className={styles.box} aria-hidden>
                <Check className={styles.icon} />
                <span className={styles.indeterminate} />
            </span>
            {children != null ? <span className={styles.label}>{children}</span> : null}
        </CheckboxButton>
    </CheckboxField>
);

Checkbox.displayName = 'Checkbox';
