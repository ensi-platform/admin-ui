import { type RefObject } from 'react';

import { ListBox, ListBoxItem } from 'react-aria-components';

import { AutocompleteListStatus } from '@/autocomplete-shared/ListStatus';

import { type ISelectOption, type TAutocompleteSize, type TAutocompleteVariant } from '../../types';
import { AutocompleteItemContent, autocompleteItemVariants } from '../Item';
import { AutocompletePopover } from '../Popover';

import { autocompleteListBoxVariants } from './theme';

export interface IAutocompleteListProps {
    triggerRef: RefObject<HTMLElement | null>;
    options: ISelectOption[];
    size: TAutocompleteSize;
    variant: TAutocompleteVariant;
    isLoading?: boolean;
    isError?: boolean;
}

export const AutocompleteList = ({
    triggerRef,
    options,
    size,
    variant,
    isLoading = false,
    isError = false,
}: IAutocompleteListProps) => {
    const showStatus = isLoading || isError || options.length === 0;

    return (
        <AutocompletePopover triggerRef={triggerRef} variant={variant}>
            {showStatus ? (
                <AutocompleteListStatus isLoading={isLoading} isError={isError} isEmpty={!isLoading && !isError} />
            ) : null}
            {!isLoading && !isError && options.length > 0 ? (
                <ListBox className={autocompleteListBoxVariants({ size })} items={options}>
                    {(item: ISelectOption) => (
                        <ListBoxItem
                            id={item.value}
                            textValue={item.label}
                            isDisabled={item.disabled}
                            className={autocompleteItemVariants({ size, variant })}
                        >
                            <AutocompleteItemContent label={item.label} />
                        </ListBoxItem>
                    )}
                </ListBox>
            ) : null}
        </AutocompletePopover>
    );
};

AutocompleteList.displayName = 'AutocompleteList';
