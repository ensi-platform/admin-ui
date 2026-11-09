import { type DropTarget } from 'react-aria';
import { DropIndicator } from 'react-aria-components';

import styles from './styles.module.css';

/** Keyboard drop slot. Stays in the DOM for arrows and does not paint a line. */
export const DropSlot = ({ target }: { target: DropTarget }) => (
    <DropIndicator target={target} className={styles.indicator} />
);

/** Clone of the dragged row. */
export const DragPreview = ({ id, list }: { id: string; list: HTMLElement | null }) => {
    const source = list?.querySelector<HTMLElement>(`[data-file-id="${CSS.escape(id)}"]`);

    if (!source) {
        return <div />;
    }

    const clone = source.cloneNode(true) as HTMLElement;

    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    clone.querySelectorAll('[data-dropzone-remove]').forEach(node => node.remove());
    clone.style.transform = 'none';
    clone.style.opacity = '1';

    return (
        <div
            className={styles.dragPreview}
            style={{ width: source.offsetWidth || undefined }}
            ref={node => {
                if (node && node.firstChild !== clone) {
                    node.replaceChildren(clone);
                }
            }}
        />
    );
};
