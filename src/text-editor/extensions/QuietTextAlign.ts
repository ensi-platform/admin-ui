import { TextAlign } from '@tiptap/extension-text-align';

/** Alignment is stored on the node. `style` is emitted by GlobalAttributes so it can merge. */
export const QuietTextAlign = TextAlign.extend({
    addGlobalAttributes() {
        const groups = this.parent?.() ?? [];

        return groups.map(group => ({
            ...group,
            attributes: {
                ...group.attributes,
                textAlign: {
                    ...group.attributes?.textAlign,
                    renderHTML: () => ({}),
                },
            },
        }));
    },
}).configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
});
