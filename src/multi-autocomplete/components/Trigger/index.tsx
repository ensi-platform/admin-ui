import { type RefObject, useState } from 'react';

import cn from 'classnames';
import {
    Button as RacButton,
    ComboBoxValue,
    Group,
    Input,
    type Key,
    Tag as RacTag,
    TagGroup,
    TagList,
} from 'react-aria-components';

import { useTagOverflow } from '@/autocomplete-shared/use-tag-overflow';
import { ChevronDown, Clear } from '@/icons';
import { useAuiLabels } from '@/provider';
import { type ISelectOption, type TSelectSize, type TSelectVariant } from '@/select/types';

import { toKeyList } from '../../utils';
import { MultiAutocompleteClearButton } from '../ClearButton';

import {
    multiAutocompleteOverflowSizeClass,
    multiAutocompleteTagSizeClass,
    multiAutocompleteTriggerVariants,
} from './theme';

import styles from './styles.module.css';

/** RAC Tag remove slot. */
const ButtonRemove = () => (
    <RacButton slot="remove" className={styles.tagRemove}>
        <Clear className={styles.tagRemoveIcon} />
    </RacButton>
);

const renderTag = (item: ISelectOption, size: TSelectSize) => (
    <RacTag id={item.value} textValue={item.label} className={cn(styles.tag, multiAutocompleteTagSizeClass(size))}>
        <span className={styles.tagLabel}>{item.label}</span>
        <ButtonRemove />
    </RacTag>
);

interface ISelectedTagsProps {
    items: ISelectOption[];
    size: TSelectSize;
    ariaLabel?: string;
    ariaLabelledby?: string;
    onRemove: (keys: Set<Key>) => void;
}

const SelectedTags = ({ items, size, ariaLabel, ariaLabelledby, onRemove }: ISelectedTagsProps) => {
    const { moreSelected } = useAuiLabels();
    const [expanded, setExpanded] = useState(false);
    const { visibleCount, containerRef, measureRef, overflowMeasureRef } = useTagOverflow(items.length, expanded);
    const hiddenCount = Math.max(0, items.length - visibleCount);
    const visibleItems = expanded || hiddenCount === 0 ? items : items.slice(0, visibleCount);

    return (
        <div ref={containerRef} className={styles.tagsViewport}>
            {items.length > 0 ? (
                <TagGroup
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
                    className={styles.tagGroup}
                    onRemove={onRemove}
                >
                    <TagList items={visibleItems} className={cn(styles.tagList, !expanded && styles.tagListCollapsed)}>
                        {(item: ISelectOption) => renderTag(item, size)}
                    </TagList>
                </TagGroup>
            ) : null}
            {hiddenCount > 0 && !expanded ? (
                <button
                    type="button"
                    className={cn(styles.overflowChip, multiAutocompleteOverflowSizeClass(size))}
                    aria-label={`${hiddenCount} ${moreSelected}`}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        setExpanded(true);
                    }}
                >
                    +{hiddenCount}
                </button>
            ) : null}
            <div ref={measureRef} className={styles.measureRow} aria-hidden>
                {items.map(item => (
                    <span key={String(item.value)} className={cn(styles.tag, multiAutocompleteTagSizeClass(size))}>
                        <span className={styles.tagLabel}>{item.label}</span>
                        <span className={styles.tagRemove}>
                            <Clear className={styles.tagRemoveIcon} />
                        </span>
                    </span>
                ))}
            </div>
            <button
                ref={overflowMeasureRef}
                type="button"
                tabIndex={-1}
                aria-hidden
                className={cn(styles.overflowChip, multiAutocompleteOverflowSizeClass(size), styles.measureRow)}
            >
                +99
            </button>
        </div>
    );
};

export interface IMultiAutocompleteTriggerProps {
    triggerRef: RefObject<HTMLDivElement | null>;
    size: TSelectSize;
    variant: TSelectVariant;
    clear: boolean;
    placeholder: string;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

export const MultiAutocompleteTrigger = ({
    triggerRef,
    size,
    variant,
    clear,
    placeholder,
    isOpen,
    isDisabled,
    isInvalid,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
}: IMultiAutocompleteTriggerProps) => (
    <div
        className={styles.triggerWrap}
        data-open={isOpen || undefined}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
    >
        <Group ref={triggerRef} className={multiAutocompleteTriggerVariants({ size, variant })}>
            <div className={styles.field}>
                <ComboBoxValue className={styles.value}>
                    {({ selectedItems, state }) => {
                        const items = selectedItems.filter((item): item is ISelectOption => item != null);

                        return (
                            <SelectedTags
                                items={items}
                                size={size}
                                ariaLabel={ariaLabel}
                                ariaLabelledby={ariaLabelledby}
                                onRemove={keys => {
                                    const current = toKeyList(state.value);

                                    state.setValue(current.filter(key => !keys.has(key)));
                                }}
                            />
                        );
                    }}
                </ComboBoxValue>
                <Input className={styles.input} placeholder={placeholder} disabled={isDisabled} />
            </div>
            <span className={styles.actions}>
                {clear ? <MultiAutocompleteClearButton isDisabled={isDisabled} size={size} variant={variant} /> : null}
                <RacButton className={styles.chevronButton} isDisabled={isDisabled}>
                    <ChevronDown className={styles.chevron} />
                </RacButton>
            </span>
        </Group>
    </div>
);

MultiAutocompleteTrigger.displayName = 'MultiAutocompleteTrigger';
