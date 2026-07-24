import { type RefObject } from 'react';

import { ListBox, ListBoxItem } from 'react-aria-components';

import { type ISelectOption, type TSelectSize, type TSelectVariant } from '@/select/types';

import { MultiSelectItemContent, multiSelectItemVariants } from '../Item';
import { MultiSelectPopover } from '../Popover';

import { multiSelectListBoxVariants } from './theme';

export interface IMultiSelectListProps {
    triggerRef: RefObject<HTMLElement | null>;
    options: ISelectOption[];
    size: TSelectSize;
    variant: TSelectVariant;
}

export const MultiSelectList = ({ triggerRef, options, size, variant }: IMultiSelectListProps) => (
    <MultiSelectPopover triggerRef={triggerRef} variant={variant}>
        <ListBox className={multiSelectListBoxVariants({ size })} items={options}>
            {(item: ISelectOption) => (
                <ListBoxItem
                    id={item.value}
                    textValue={item.label}
                    isDisabled={item.disabled}
                    className={multiSelectItemVariants({ size, variant })}
                >
                    <MultiSelectItemContent label={item.label} />
                </ListBoxItem>
            )}
        </ListBox>
    </MultiSelectPopover>
);

MultiSelectList.displayName = 'MultiSelectList';
