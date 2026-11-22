import { Node } from '@tiptap/core';

/** Video embed. The stored tag is an iframe; the host sanitizes the URL. */
export const Iframe = Node.create({
    name: 'iframe',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: element => element.getAttribute('src'),
                renderHTML: attributes => (attributes.src ? { src: attributes.src } : {}),
            },
        };
    },

    parseHTML() {
        return [{ tag: 'iframe' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['iframe', HTMLAttributes];
    },
});
