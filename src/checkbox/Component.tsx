import cn from 'classnames';
import { Checkbox as RacCheckbox } from 'react-aria-components';

import { Check } from '../icons/index.js';

import { checkboxVariants } from './theme.js';
import { type ICheckboxProps } from './types.js';

import styles from './styles.module.css';

export const Checkbox = ({
    ref,
    size = 'md',
    checked,
    defaultChecked,
    onChange,
    indeterminate = false,
    value,
    children,
    isInvalid = false,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ICheckboxProps) => (
    <RacCheckbox
        {...props}
        ref={ref}
        value={value}
        isSelected={checked}
        defaultSelected={defaultChecked}
        onChange={onChange}
        isIndeterminate={indeterminate}
        isDisabled={disabled}
        isInvalid={isInvalid}
        data-invalid={isInvalid || undefined}
        data-test-id={dataTestId}
        className={cn(checkboxVariants({ size }), className)}
    >
        <span className={styles.box} aria-hidden>
            <Check className={styles.icon} />
            <span className={styles.indeterminate} />
        </span>
        {children != null ? <span className={styles.label}>{children}</span> : null}
    </RacCheckbox>
);

Checkbox.displayName = 'Checkbox';
