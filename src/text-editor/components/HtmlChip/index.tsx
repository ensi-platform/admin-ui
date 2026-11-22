import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react';

import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

export const HtmlChip = ({ deleteNode, editor }: NodeViewProps) => {
    const { htmlBlock, htmlBlockRemove } = useAuiLabels();

    return (
        <NodeViewWrapper data-html-chip="" className={styles.root} contentEditable={false}>
            <span>{htmlBlock}</span>
            {editor.isEditable ? (
                <button type="button" className={styles.remove} onClick={deleteNode}>
                    {htmlBlockRemove}
                </button>
            ) : null}
        </NodeViewWrapper>
    );
};
