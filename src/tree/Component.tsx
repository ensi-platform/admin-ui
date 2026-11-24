import { useMemo, useState } from 'react';

import cn from 'classnames';
import { Tree as RacTree, type Selection } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { TreeRow } from './components/Item';
import { type ITreeProps } from './types';
import { collectDisabledKeys, collectTreeKeys } from './utils';

import styles from './styles.module.css';

const emptySelection: Selection = new Set();

const toSelectionProps = (
    lockSelection: boolean,
    selectedKeys: Selection | undefined,
    defaultSelectedKeys: Selection | undefined,
    uncontrolledSelection: Selection
) => {
    if (lockSelection) return { selectedKeys: selectedKeys ?? uncontrolledSelection };
    if (selectedKeys !== undefined) return { selectedKeys };

    return { defaultSelectedKeys };
};

export const Tree = supportRef(
    ({
        ref,
        items,
        selectionMode = 'single',
        selectedKeys,
        defaultSelectedKeys,
        onSelectionChange,
        expandedKeys,
        defaultExpandedKeys,
        onExpandedChange,
        disabled = false,
        readOnly = false,
        className,
        dataTestId,
        'aria-label': ariaLabel,
    }: ITreeProps) => {
        const [uncontrolledSelection] = useState<Selection>(() => defaultSelectedKeys ?? emptySelection);
        const lockSelection = readOnly && !disabled;
        const disabledKeys = useMemo(
            () => (disabled ? collectTreeKeys(items) : collectDisabledKeys(items)),
            [disabled, items]
        );
        const selectionProps = toSelectionProps(
            lockSelection,
            selectedKeys,
            defaultSelectedKeys,
            uncontrolledSelection
        );

        return (
            <RacTree
                ref={ref}
                aria-label={ariaLabel}
                className={cn(styles.root, className)}
                items={items}
                selectionMode={selectionMode}
                selectionBehavior={selectionMode === 'multiple' ? 'toggle' : 'replace'}
                // Single mode clears a selected row on a second press when empty selection is allowed.
                // A controlled empty `selectedKeys` still clears from outside.
                disallowEmptySelection={selectionMode === 'single'}
                disabledKeys={disabledKeys}
                disabledBehavior="all"
                data-test-id={dataTestId}
                onSelectionChange={keys => {
                    if (lockSelection || disabled) return;

                    onSelectionChange?.(keys);
                }}
                onExpandedChange={onExpandedChange}
                {...selectionProps}
                {...(expandedKeys !== undefined ? { expandedKeys } : { defaultExpandedKeys })}
            >
                {item => <TreeRow item={item} readOnly={lockSelection} />}
            </RacTree>
        );
    }
);

Tree.displayName = 'Tree';
