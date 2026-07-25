import { type RefObject } from 'react';

import { ListBox, ListBoxItem } from 'react-aria-components';

import { type ISelectOption, type TSelectSize, type TSelectVariant } from '../../types';
import { SelectItemContent, selectItemVariants } from '../Item';
import { SelectPopover } from '../Popover';

import { selectListBoxVariants } from './theme';

export interface ISelectListProps {
    triggerRef: RefObject<HTMLElement | null>;
    options: ISelectOption[];
    size: TSelectSize;
    variant: TSelectVariant;
}

export const SelectList = ({ triggerRef, options, size, variant }: ISelectListProps) => (
    <SelectPopover triggerRef={triggerRef} variant={variant}>
        <ListBox className={selectListBoxVariants({ size })} items={options}>
            {(item: ISelectOption) => (
                <ListBoxItem
                    id={item.value}
                    textValue={item.label}
                    isDisabled={item.disabled}
                    className={selectItemVariants({ size, variant })}
                >
                    <SelectItemContent label={item.label} />
                </ListBoxItem>
            )}
        </ListBox>
    </SelectPopover>
);

SelectList.displayName = 'SelectList';
