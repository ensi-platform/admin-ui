import { useRef } from 'react';

import cn from 'classnames';
import { Select as RacSelect } from 'react-aria-components';

import { SelectList } from './components/List';
import { SelectTrigger } from './components/Trigger';
import { selectVariants } from './theme';
import { type ISelectProps, type TSelectValue } from './types';
import { toSelectedKey } from './utils';

export const Select = ({
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
    ...props
}: ISelectProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const selectedKey = toSelectedKey(value);
    const defaultSelectedKey = toSelectedKey(defaultValue);

    return (
        <RacSelect
            {...props}
            ref={ref}
            selectedKey={selectedKey}
            defaultSelectedKey={defaultSelectedKey}
            onSelectionChange={key => {
                onChange?.(key as TSelectValue | null);
            }}
            placeholder={placeholder ?? ''}
            isDisabled={disabled}
            isInvalid={invalid}
            onBlur={onBlur}
            data-invalid={invalid || undefined}
            data-test-id={dataTestId}
            className={cn(selectVariants({ block }), className)}
        >
            {({ isFocusVisible, isOpen, isDisabled: isSelectDisabled, isInvalid: isSelectInvalid }) => (
                <>
                    <SelectTrigger
                        triggerRef={triggerRef}
                        size={size}
                        variant={variant}
                        clear={clear}
                        isFocusVisible={isFocusVisible}
                        isOpen={isOpen}
                        isDisabled={isSelectDisabled}
                        isInvalid={isSelectInvalid}
                    />
                    <SelectList triggerRef={triggerRef} options={options} size={size} variant={variant} />
                </>
            )}
        </RacSelect>
    );
};

Select.displayName = 'Select';
