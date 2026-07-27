import { type RefObject } from 'react';

import { ListBox, ListBoxItem } from 'react-aria-components';

import { type IComboboxOption, type TComboboxSize, type TComboboxVariant } from '../../types';
import { ComboboxItemContent, comboboxItemVariants } from '../Item';
import { ComboboxListStatus } from '../ListStatus';
import { ComboboxPopover } from '../Popover';

import { comboboxListBoxVariants } from './theme';

export interface IComboboxListProps {
    triggerRef: RefObject<HTMLElement | null>;
    options: IComboboxOption[];
    size: TComboboxSize;
    variant: TComboboxVariant;
    isLoading?: boolean;
    isError?: boolean;
    /** When true, empty options show ListStatus empty chrome (autocomplete). */
    showEmptyStatus?: boolean;
}

export const ComboboxList = ({
    triggerRef,
    options,
    size,
    variant,
    isLoading = false,
    isError = false,
    showEmptyStatus = false,
}: IComboboxListProps) => {
    const showStatus = isLoading || isError || (showEmptyStatus && options.length === 0);
    const showItems = !isLoading && !isError && (!showEmptyStatus || options.length > 0);

    return (
        <ComboboxPopover triggerRef={triggerRef} variant={variant}>
            {showStatus ? (
                <ComboboxListStatus isLoading={isLoading} isError={isError} isEmpty={!isLoading && !isError} />
            ) : null}
            {showItems ? (
                <ListBox className={comboboxListBoxVariants({ size })} items={options}>
                    {(item: IComboboxOption) => (
                        <ListBoxItem
                            id={item.value}
                            textValue={item.label}
                            isDisabled={item.disabled}
                            className={comboboxItemVariants({ size, variant })}
                        >
                            <ComboboxItemContent label={item.label} />
                        </ListBoxItem>
                    )}
                </ListBox>
            ) : null}
        </ComboboxPopover>
    );
};

ComboboxList.displayName = 'ComboboxList';
