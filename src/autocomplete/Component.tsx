import { useRef } from 'react';

import cn from 'classnames';
import { ComboBox as RacComboBox } from 'react-aria-components';

import { AutocompleteList } from './components/List';
import { AutocompleteTrigger } from './components/Trigger';
import { autocompleteVariants } from './theme';
import { type IAutocompleteProps, type TSelectValue } from './types';
import { toSelectedKey } from './utils';

export const Autocomplete = ({
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
    ...props
}: IAutocompleteProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const selectedKey = toSelectedKey(value);
    const defaultSelectedKey = toSelectedKey(defaultValue);

    return (
        <RacComboBox
            {...props}
            ref={ref}
            selectionMode="single"
            value={selectedKey}
            defaultValue={defaultSelectedKey}
            onChange={key => {
                onChange?.(key as TSelectValue | null);
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
            data-invalid={invalid || undefined}
            data-test-id={dataTestId}
            className={cn(autocompleteVariants({ block }), className)}
        >
            {({ isOpen, isDisabled: isComboDisabled, isInvalid: isComboInvalid }) => (
                <>
                    <AutocompleteTrigger
                        triggerRef={triggerRef}
                        size={size}
                        variant={variant}
                        clear={clear}
                        placeholder={placeholder ?? ''}
                        isOpen={isOpen}
                        isDisabled={isComboDisabled}
                        isInvalid={isComboInvalid}
                    />
                    <AutocompleteList
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

Autocomplete.displayName = 'Autocomplete';
