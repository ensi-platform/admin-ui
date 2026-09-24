import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import cn from 'classnames';

import { ChevronDown } from '@/icons';
import { Popover } from '@/popover';
import { tagVariants } from '@/tag/theme';

import { type IActiveFiltersGroupProps } from '../../types';
import { isNestedOverlayTarget } from '../../utils';
import { ActiveFiltersRemove } from '../Remove';

import styles from './styles.module.css';

const closeUnlessNested = (element: Element) => !isNestedOverlayTarget(element);

export const ActiveFiltersGroup = ({
    ref,
    label,
    count,
    children,
    onRemove,
    scroll = 'auto',
    className,
    dataTestId,
    ...props
}: IActiveFiltersGroupProps) => {
    const [open, setOpen] = useState(false);
    const chipRef = useRef<HTMLSpanElement>(null);
    const [minWidth, setMinWidth] = useState<number>();

    const setChipNode = useCallback((node: HTMLSpanElement | null) => {
        chipRef.current = node;

        if (node) {
            setMinWidth(node.offsetWidth);
        }
    }, []);

    useLayoutEffect(() => {
        setMinWidth(chipRef.current!.offsetWidth);
    }, [label, count]);

    return (
        <span
            ref={setChipNode}
            className={cn(tagVariants({ size: 'md', variant: 'primary' }), styles.group, className)}
            data-open={open || undefined}
        >
            <Popover isOpen={open} onOpenChange={setOpen}>
                <Popover.Trigger>
                    <button
                        {...props}
                        ref={ref}
                        type="button"
                        className={styles.trigger}
                        data-test-id={dataTestId}
                        data-open={open || undefined}
                    >
                        <span className={styles.label}>
                            {label}: {count}
                        </span>
                        <ChevronDown className={styles.chevron} />
                    </button>
                </Popover.Trigger>
                <Popover.Content
                    className={styles.panel}
                    data-scroll={scroll}
                    placement="bottom start"
                    triggerRef={chipRef}
                    shouldCloseOnInteractOutside={closeUnlessNested}
                    style={minWidth ? { minWidth } : undefined}
                >
                    <div className={styles.list}>{children}</div>
                </Popover.Content>
            </Popover>
            {onRemove ? <ActiveFiltersRemove onRemove={onRemove} /> : null}
        </span>
    );
};

ActiveFiltersGroup.displayName = 'ActiveFilters.Group';
