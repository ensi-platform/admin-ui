import { useRef } from 'react';

import cn from 'classnames';
import { type Key, ComboBox as RacComboBox } from 'react-aria-components';

import { MultiAutocompleteList } from './components/List';
import { MultiAutocompleteTrigger } from './components/Trigger';
import { multiAutocompleteVariants } from './theme';
import { type IMultiAutocompleteProps } from './types';
import { fromMultiValue, toMultiValue } from './utils';

export const MultiAutocomplete = ({
    ref,
    options,
    value,
    defaultValue,
    onChange,
    inputValue,
    defaultInputValue,
    onInputChange,
    placeholder,
    clear = false,
    clientFilter = true,
    isLoading = false,
    isError = false,
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
}: IMultiAutocompleteProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);

    return (
        <RacComboBox
            {...props}
            ref={ref}
            selectionMode="multiple"
            value={toMultiValue(value)}
            defaultValue={toMultiValue(defaultValue)}
            onChange={(keys: Key[]) => {
                onChange?.(fromMultiValue(keys));
            }}
            inputValue={inputValue}
            defaultInputValue={defaultInputValue}
            onInputChange={onInputChange}
            defaultItems={clientFilter ? options : undefined}
            items={clientFilter ? undefined : options}
            allowsEmptyCollection={!clientFilter || isLoading || isError || options.length === 0}
            isDisabled={disabled}
            isInvalid={invalid}
            onBlur={onBlur}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-invalid={invalid || undefined}
            data-test-id={dataTestId}
            className={cn(multiAutocompleteVariants({ block }), className)}
        >
            {({ isOpen, isDisabled: isComboDisabled, isInvalid: isComboInvalid }) => (
                <>
                    <MultiAutocompleteTrigger
                        triggerRef={triggerRef}
                        size={size}
                        variant={variant}
                        clear={clear}
                        placeholder={placeholder ?? ''}
                        isOpen={isOpen}
                        isDisabled={isComboDisabled}
                        isInvalid={isComboInvalid}
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledby}
                    />
                    <MultiAutocompleteList
                        triggerRef={triggerRef}
                        options={options}
                        size={size}
                        variant={variant}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </>
            )}
        </RacComboBox>
    );
};

MultiAutocomplete.displayName = 'MultiAutocomplete';
