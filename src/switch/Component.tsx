import cn from 'classnames';
import { SwitchButton, SwitchField } from 'react-aria-components';

import { switchVariants } from './theme';
import { type ISwitchProps } from './types';

import styles from './styles.module.css';

export const Switch = ({
    ref,
    size = 'md',
    variant = 'primary',
    checked,
    defaultChecked,
    onChange,
    children,
    invalid = false,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ISwitchProps) => (
    <SwitchField
        {...props}
        isSelected={checked}
        defaultSelected={defaultChecked}
        onChange={onChange}
        isDisabled={disabled}
        isInvalid={invalid}
    >
        <SwitchButton
            ref={ref}
            data-test-id={dataTestId}
            className={cn(switchVariants({ size, variant }), invalid && styles.invalid, className)}
        >
            <span className={styles.track} aria-hidden>
                <span className={styles.thumb} />
            </span>
            {children != null ? <span className={styles.label}>{children}</span> : null}
        </SwitchButton>
    </SwitchField>
);

Switch.displayName = 'Switch';
