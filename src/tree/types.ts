import { type Ref } from 'react';

import { type Key, type Selection } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

/** One node. Omit `children` or pass an empty list for a leaf. */
export interface ITreeItem {
    /** Node key. */
    id: string | number;
    /** Visible label. */
    label: string;
    /** Nested nodes. */
    children?: ITreeItem[];
    /** Blocks selection and expansion of this node. */
    disabled?: boolean;
}

/** Selection mode. */
export type TTreeSelectionMode = 'none' | 'single' | 'multiple';

/** Selection and expansion state. */
export interface ITreeControlProps {
    /** Selection mode. */
    selectionMode?: TTreeSelectionMode;
    /** Controlled selection. An empty set means nothing is selected. */
    selectedKeys?: Selection;
    /** Uncontrolled initial selection. */
    defaultSelectedKeys?: Selection;
    /** Selection change handler. */
    onSelectionChange?: (keys: Selection) => void;
    /** Controlled expanded branches. */
    expandedKeys?: Iterable<Key>;
    /** Uncontrolled initial expanded branches. */
    defaultExpandedKeys?: Iterable<Key>;
    /** Expanded branches change handler. */
    onExpandedChange?: (keys: Set<Key>) => void;
    /** Blocks selection and expansion for every node. */
    disabled?: boolean;
    /** Keeps the current selection. Expansion still works. */
    readOnly?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface ITreeOwnProps extends IDataTestIdProps {
    /** Nodes. */
    items: ITreeItem[];
    /** Accessible name. The tree has no visible caption. */
    'aria-label': string;
    /** Root class name. */
    className?: string;
    /** Ref to the tree root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface ITreeProps extends ITreeControlProps, ITreeOwnProps {}
