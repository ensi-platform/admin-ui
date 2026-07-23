import cn from 'classnames';
import { Switch as RacSwitch } from 'react-aria-components';

import { switchVariants } from './theme.js';
import { type ISwitchProps } from './types.js';

import styles from './styles.module.css';

export const Switch = ({
    ref,
    size = 'md',
    checked,
    defaultChecked,
    onChange,
    children,
    isInvalid = false,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ISwitchProps) => (
    <RacSwitch
        {...props}
        ref={ref}
        isSelected={checked}
        defaultSelected={defaultChecked}
        onChange={onChange}
        isDisabled={disabled}
        data-test-id={dataTestId}
        className={cn(switchVariants({ size }), isInvalid && styles.invalid, className)}
    >
        <span className={styles.track} aria-hidden>
            <span className={styles.thumb} />
        </span>
        {children != null ? <span className={styles.label}>{children}</span> : null}
    </RacSwitch>
);

Switch.displayName = 'Switch';
