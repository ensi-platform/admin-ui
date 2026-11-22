import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { HtmlChip } from '../components/HtmlChip';

/** Opaque foreign markup. The editor shows a chip; the stored slice is returned as-is. */
export const HtmlBlock = Node.create({
    name: 'htmlBlock',
    group: 'block',
    atom: true,
    selectable: true,

    addAttributes() {
        return {
            html: {
                default: '',
                parseHTML: (element: HTMLElement) => {
                    const raw = element.getAttribute('data-html');

                    if (!raw) {
                        return '';
                    }

                    try {
                        return decodeURIComponent(raw);
                    } catch {
                        return '';
                    }
                },
                renderHTML: (attributes: { html?: string }) => ({
                    'data-html': encodeURIComponent(attributes.html ?? ''),
                }),
            },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-html-block]', priority: 1000 }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-html-block': '' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(HtmlChip);
    },
});
