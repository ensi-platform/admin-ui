import { type Editor, generateHTML } from '@tiptap/core';

import { isEmptyDoc } from '../utils';

import { textEditorExtensions } from './index';

/** Serializes the document, splicing foreign blocks back in unchanged. */
export const readEditorHtml = (editor: Editor) => {
    const parts: string[] = [];

    editor.state.doc.forEach(node => {
        if (node.type.name === 'htmlBlock') {
            parts.push(String(node.attrs.html ?? ''));
            return;
        }

        parts.push(generateHTML({ type: 'doc', content: [node.toJSON()] }, textEditorExtensions));
    });

    const html = parts.join('');

    return isEmptyDoc(html) ? '' : html;
};
