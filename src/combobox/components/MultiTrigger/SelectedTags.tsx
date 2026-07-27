import { type ReactNode, type RefObject, useContext } from 'react';

import cn from 'classnames';
import { Button as RacButton, type Key, Tag as RacTag, TagGroup, TagList } from 'react-aria-components';

import { Clear } from '@/icons';
import { AuiContext, defaultLabels } from '@/provider/context';

import { useTagOverflow } from '../../hooks/useTagOverflow';
import { type IComboboxOption, type TComboboxSize } from '../../types';

import { comboboxOverflowSizeClass, comboboxTagSizeClass } from './theme';

import styles from './styles.module.css';

/** RAC Tag remove slot. */
const ButtonRemove = () => (
    <RacButton slot="remove" className={styles.tagRemove}>
        <Clear className={styles.tagRemoveIcon} />
    </RacButton>
);

export interface ISelectedTagsProps {
    items: IComboboxOption[];
    size: TComboboxSize;
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    onRemove: (keys: Set<Key>) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    /** Trailing content (e.g. combobox filter input + sizer). */
    trailingSlot?: ReactNode;
    /** Reserve width for trailing content when measuring overflow. */
    trailingReserveRef?: RefObject<HTMLElement | null>;
    /** Bumps overflow recalc when trailing content changes. */
    trailingContentKey?: string;
}

export const SelectedTags = ({
    items,
    size,
    expanded,
    onExpandedChange,
    onRemove,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    trailingSlot,
    trailingReserveRef,
    trailingContentKey,
}: ISelectedTagsProps) => {
    const moreSelected = useContext(AuiContext)?.labels.moreSelected ?? defaultLabels.moreSelected;
    const { visibleCount, containerRef, measureRef, overflowMeasureRef } = useTagOverflow(items.length, expanded, {
        trailingReserveRef,
        trailingContentKey,
    });
    const hiddenCount = Math.max(0, items.length - visibleCount);
    const visibleItems = expanded || hiddenCount === 0 ? items : items.slice(0, visibleCount);

    return (
        <div ref={containerRef} className={styles.field} data-expanded={expanded || undefined}>
            {items.length > 0 ? (
                <TagGroup
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
                    className={styles.contents}
                    onRemove={onRemove}
                >
                    <TagList items={visibleItems} className={styles.contents}>
                        {(item: IComboboxOption) => (
                            <RacTag
                                id={item.value}
                                textValue={item.label}
                                className={cn(styles.tag, comboboxTagSizeClass(size))}
                            >
                                <span className={styles.tagLabel}>{item.label}</span>
                                <ButtonRemove />
                            </RacTag>
                        )}
                    </TagList>
                </TagGroup>
            ) : null}
            {hiddenCount > 0 && !expanded ? (
                <button
                    type="button"
                    className={cn(styles.overflowChip, comboboxOverflowSizeClass(size))}
                    aria-label={`${hiddenCount} ${moreSelected}`}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        onExpandedChange(true);
                    }}
                >
                    +{hiddenCount}
                </button>
            ) : null}
            {trailingSlot}
            <div ref={measureRef} className={styles.measureRow} aria-hidden>
                {items.map(item => (
                    <span key={String(item.value)} className={cn(styles.tag, comboboxTagSizeClass(size))}>
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
                className={cn(styles.overflowChip, comboboxOverflowSizeClass(size), styles.measureRow)}
            >
                +99
            </button>
        </div>
    );
};

SelectedTags.displayName = 'SelectedTags';
