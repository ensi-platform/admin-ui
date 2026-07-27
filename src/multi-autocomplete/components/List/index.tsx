import { type RefObject } from 'react';

import { ListBox, ListBoxItem } from 'react-aria-components';

import { AutocompleteListStatus } from '@/autocomplete-shared/ListStatus';

import { type ISelectOption, type TMultiAutocompleteSize, type TMultiAutocompleteVariant } from '../../types';
import { MultiAutocompleteItemContent, multiAutocompleteItemVariants } from '../Item';
import { MultiAutocompletePopover } from '../Popover';

import { multiAutocompleteListBoxVariants } from './theme';

export interface IMultiAutocompleteListProps {
    triggerRef: RefObject<HTMLElement | null>;
    options: ISelectOption[];
    size: TMultiAutocompleteSize;
    variant: TMultiAutocompleteVariant;
    isLoading?: boolean;
    isError?: boolean;
}

export const MultiAutocompleteList = ({
    triggerRef,
    options,
    size,
    variant,
    isLoading = false,
    isError = false,
}: IMultiAutocompleteListProps) => {
    const showStatus = isLoading || isError || options.length === 0;

    return (
        <MultiAutocompletePopover triggerRef={triggerRef} variant={variant}>
            {showStatus ? (
                <AutocompleteListStatus isLoading={isLoading} isError={isError} isEmpty={!isLoading && !isError} />
            ) : null}
            {!isLoading && !isError && options.length > 0 ? (
                <ListBox className={multiAutocompleteListBoxVariants({ size })} items={options}>
                    {(item: ISelectOption) => (
                        <ListBoxItem
                            id={item.value}
                            textValue={item.label}
                            isDisabled={item.disabled}
                            className={multiAutocompleteItemVariants({ size, variant })}
                        >
                            <MultiAutocompleteItemContent label={item.label} />
                        </ListBoxItem>
                    )}
                </ListBox>
            ) : null}
        </MultiAutocompletePopover>
    );
};

MultiAutocompleteList.displayName = 'MultiAutocompleteList';
