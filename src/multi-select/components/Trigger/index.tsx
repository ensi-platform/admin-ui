import { type MouseEvent, type RefObject, useContext } from 'react';

import cn from 'classnames';
import {
    Button as RacButton,
    Group,
    SelectStateContext,
    SelectValue,
    Tag as RacTag,
    TagGroup,
    TagList,
} from 'react-aria-components';

import { ChevronDown, Clear } from '@/icons';
import { type ISelectOption, type TSelectSize, type TSelectVariant } from '@/select/types';

import { MultiSelectClearButton } from '../ClearButton';

import { multiSelectTagSizeClass, multiSelectTriggerVariants } from './theme';

import styles from './styles.module.css';

/** RAC Tag remove slot, styled with our tag tokens. */
const ButtonRemove = () => (
    <RacButton slot="remove" className={styles.tagRemove}>
        <Clear className={styles.tagRemoveIcon} />
    </RacButton>
);

const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return Boolean(target.closest('[role="row"], [slot="remove"], button'));
};

export interface IMultiSelectTriggerProps {
    triggerRef: RefObject<HTMLDivElement | null>;
    size: TSelectSize;
    variant: TSelectVariant;
    clear: boolean;
    placeholder: string;
    isFocusVisible: boolean;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

export const MultiSelectTrigger = ({
    triggerRef,
    size,
    variant,
    clear,
    placeholder,
    isFocusVisible,
    isOpen,
    isDisabled,
    isInvalid,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
}: IMultiSelectTriggerProps) => {
    const selectState = useContext(SelectStateContext);

    const openFromField = (event: MouseEvent) => {
        if (isDisabled || isInteractiveTarget(event.target)) {
            return;
        }

        selectState?.open();
    };

    return (
        <div
            className={styles.triggerWrap}
            data-size={size}
            data-clear={clear || undefined}
            data-focus-visible={isFocusVisible || undefined}
            data-open={isOpen || undefined}
            data-disabled={isDisabled || undefined}
            data-invalid={isInvalid || undefined}
        >
            <Group ref={triggerRef} className={multiSelectTriggerVariants({ size, variant })} onClick={openFromField}>
                <SelectValue className={styles.value}>
                    {({ selectedItems, isPlaceholder, state }) => {
                        if (isPlaceholder) {
                            return <span className={styles.placeholder}>{placeholder}</span>;
                        }

                        const items = selectedItems.filter((item): item is ISelectOption => item != null);

                        return (
                            <TagGroup
                                aria-label={ariaLabel}
                                aria-labelledby={ariaLabelledby}
                                className={styles.tagGroup}
                                onRemove={keys => {
                                    const current = Array.isArray(state.value) ? state.value : [];
                                    state.setValue(current.filter(key => !keys.has(key)));
                                }}
                            >
                                <TagList items={items} className={styles.tagList}>
                                    {(item: ISelectOption) => (
                                        <RacTag
                                            id={item.value}
                                            textValue={item.label}
                                            className={cn(styles.tag, multiSelectTagSizeClass(size))}
                                            onAction={() => {
                                                const current = Array.isArray(state.value) ? state.value : [];
                                                state.setValue(current.filter(key => key !== item.value));
                                            }}
                                        >
                                            <span className={styles.tagLabel}>{item.label}</span>
                                            <ButtonRemove />
                                        </RacTag>
                                    )}
                                </TagList>
                            </TagGroup>
                        );
                    }}
                </SelectValue>
                <RacButton className={styles.chevronButton} isDisabled={isDisabled}>
                    <ChevronDown className={styles.chevron} />
                </RacButton>
            </Group>
            {clear ? (
                <div className={styles.clearSlot}>
                    <MultiSelectClearButton isDisabled={isDisabled} size={size} variant={variant} />
                </div>
            ) : null}
        </div>
    );
};

MultiSelectTrigger.displayName = 'MultiSelectTrigger';
