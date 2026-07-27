import { useRef } from 'react';

import cn from 'classnames';
import { type Key, Select as RacSelect } from 'react-aria-components';

import { ComboboxList, ComboboxMultiTrigger } from '@/combobox';

import { multiSelectVariants } from './theme';
import { type IMultiSelectProps } from './types';
import { fromMultiValue, toMultiValue } from './utils';

export const MultiSelect = ({
    ref,
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    clear = false,
    size = 'md',
    variant = 'primary',
    block = true,
    invalid = false,
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
            isInvalid={invalid}
            onBlur={onBlur}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-invalid={invalid || undefined}
            data-test-id={dataTestId}
            className={cn(multiSelectVariants({ block }), className)}
        >
            {({ isFocusVisible, isOpen, isDisabled: isSelectDisabled, isInvalid: isSelectInvalid }) => (
                <>
                    <ComboboxMultiTrigger
                        mode="select"
                        triggerRef={triggerRef}
                        options={options}
                        size={size}
                        variant={variant}
                        clear={clear}
                        placeholder={placeholder ?? ''}
                        isFocusVisible={isFocusVisible}
                        isOpen={isOpen}
                        isDisabled={isSelectDisabled}
                        isInvalid={isSelectInvalid}
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledby}
                    />
                    <ComboboxList triggerRef={triggerRef} options={options} size={size} variant={variant} />
                </>
            )}
        </RacSelect>
    );
};

MultiSelect.displayName = 'MultiSelect';
