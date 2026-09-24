import { type RefObject } from 'react';

import { Collection, ListBox, ListBoxItem, ListBoxLoadMoreItem, ListLayout, Virtualizer } from 'react-aria-components';

import { useAuiLabels } from '@/provider';

import { type IComboboxOption, type TComboboxSize, type TComboboxVariant } from '../../types';
import { ComboboxItemContent, comboboxItemVariants } from '../Item';
import { ComboboxListStatus } from '../ListStatus';
import { ComboboxPopover } from '../Popover';

import { useComboboxListMetrics } from './metrics';
import { comboboxListBoxVariants } from './theme';

import styles from './styles.module.css';

const LoadMoreStatus = () => {
    const { loadingSuggestions } = useAuiLabels();

    return (
        <span className={styles.more} role="status">
            {loadingSuggestions}
        </span>
    );
};

export interface IComboboxListProps {
    triggerRef: RefObject<HTMLElement | null>;
    options: IComboboxOption[];
    size: TComboboxSize;
    variant: TComboboxVariant;
    isLoading?: boolean;
    isError?: boolean;
    /** When true, empty options show ListStatus empty chrome (autocomplete). */
    showEmptyStatus?: boolean;
    /** Further pages exist. Renders a sentinel at the end of the virtual list. */
    hasMore?: boolean;
    /** Fetch the next page. Called when the sentinel nears the viewport. */
    onLoadMore?: () => void;
    /** True while a later page is loading. Keeps already shown options. */
    isLoadingMore?: boolean;
}

export const ComboboxList = ({
    triggerRef,
    options,
    size,
    variant,
    isLoading = false,
    isError = false,
    showEmptyStatus = false,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false,
}: IComboboxListProps) => {
    const { rowSize, padding } = useComboboxListMetrics(size);
    const showStatus = isLoading || (isError && options.length === 0) || (showEmptyStatus && options.length === 0);
    const showItems = !isLoading && !(isError && options.length === 0) && (!showEmptyStatus || options.length > 0);
    const showMore = showItems && (hasMore || isLoadingMore) && onLoadMore != null;

    return (
        <ComboboxPopover triggerRef={triggerRef} variant={variant}>
            {showStatus ? (
                <ComboboxListStatus isLoading={isLoading} isError={isError} isEmpty={!isLoading && !isError} />
            ) : null}
            {showItems ? (
                <Virtualizer layout={ListLayout} layoutOptions={{ rowSize, padding, loaderSize: rowSize }}>
                    <ListBox className={comboboxListBoxVariants({ size })}>
                        <Collection items={options}>
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
                        </Collection>
                        {showMore ? (
                            <ListBoxLoadMoreItem isLoading={isLoadingMore} onLoadMore={onLoadMore}>
                                {isLoadingMore ? <LoadMoreStatus /> : null}
                            </ListBoxLoadMoreItem>
                        ) : null}
                    </ListBox>
                </Virtualizer>
            ) : null}
        </ComboboxPopover>
    );
};

ComboboxList.displayName = 'ComboboxList';
