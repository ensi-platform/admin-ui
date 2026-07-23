import cn from 'classnames';
import { ListBox, ListBoxItem, Popover } from 'react-aria-components';

import { Check } from '../../../icons/index.js';
import { type ISelectOption, type TSelectSize } from '../../types.js';
import { selectTypeClass } from '../Trigger/theme.js';

import styles from './styles.module.css';

export interface ISelectListProps {
    options: ISelectOption[];
    size: TSelectSize;
}

export const SelectList = ({ options, size }: ISelectListProps) => (
    <Popover className={styles.popover} offset={4}>
        <ListBox className={cn(styles.list, selectTypeClass(size))} items={options}>
            {(item: ISelectOption) => (
                <ListBoxItem id={item.value} textValue={item.label} isDisabled={item.disabled} className={styles.item}>
                    <span className={styles.itemLabel}>{item.label}</span>
                    <Check className={styles.check} />
                </ListBoxItem>
            )}
        </ListBox>
    </Popover>
);

SelectList.displayName = 'SelectList';
