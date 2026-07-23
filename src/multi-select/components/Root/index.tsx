import { useRef } from 'react';

import cn from 'classnames';
import { type Key, Select as RacSelect } from 'react-aria-components';

import { type IMultiSelectProps } from '../../types.js';
import { fromMultiValue, toMultiValue } from '../../utils.js';
import { MultiSelectList } from '../List/index.js';
import { MultiSelectTrigger } from '../Trigger/index.js';

import styles from './styles.module.css';

export const MultiSelectRoot = ({
    ref,
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    clear = false,
    size = 'md',
    isInvalid = false,
    disabled = false,
    className,
    dataTestId,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
}: IMultiSelectProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);

    return (
        <RacSelect
            {...props}
            ref={ref}
            selectionMode="multiple"
            value={toMultiValue(value)}
            defaultValue={toMultiValue(defaultValue)}
            onChange={(keys: Key[]) => {
                onChange?.(fromMultiValue(keys));
            }}
            placeholder={placeholder ?? ''}
            isDisabled={disabled}
            isInvalid={isInvalid}
            onBlur={onBlur}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-invalid={isInvalid || undefined}
            data-test-id={dataTestId}
            className={cn(styles.root, className)}
        >
            {({ isFocusVisible, isOpen, isDisabled: isSelectDisabled, isInvalid: isSelectInvalid }) => (
                <>
                    <MultiSelectTrigger
                        triggerRef={triggerRef}
                        size={size}
                        clear={clear}
                        placeholder={placeholder ?? ''}
                        isFocusVisible={isFocusVisible}
                        isOpen={isOpen}
                        isDisabled={isSelectDisabled}
                        isInvalid={isSelectInvalid}
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledby}
                    />
                    <MultiSelectList triggerRef={triggerRef} options={options} size={size} />
                </>
            )}
        </RacSelect>
    );
};

MultiSelectRoot.displayName = 'MultiSelect';
