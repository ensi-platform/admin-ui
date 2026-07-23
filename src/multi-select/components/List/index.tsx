import { type RefObject } from 'react';

import cn from 'classnames';
import { ListBox, ListBoxItem, Popover } from 'react-aria-components';

import { Check } from '../../../icons/index.js';
import { type ISelectOption, type TSelectSize } from '../../../select/types.js';
import { multiSelectTypeClass } from '../Trigger/theme.js';

import styles from './styles.module.css';

export interface IMultiSelectListProps {
    triggerRef: RefObject<HTMLElement | null>;
    options: ISelectOption[];
    size: TSelectSize;
}

export const MultiSelectList = ({ triggerRef, options, size }: IMultiSelectListProps) => (
    <Popover triggerRef={triggerRef} className={styles.popover} offset={4}>
        <ListBox className={cn(styles.list, multiSelectTypeClass(size))} items={options}>
            {(item: ISelectOption) => (
                <ListBoxItem id={item.value} textValue={item.label} isDisabled={item.disabled} className={styles.item}>
                    <span className={styles.itemLabel}>{item.label}</span>
                    <Check className={styles.check} />
                </ListBoxItem>
            )}
        </ListBox>
    </Popover>
);

MultiSelectList.displayName = 'MultiSelectList';
