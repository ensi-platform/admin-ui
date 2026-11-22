import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, type EditorState, type Transaction } from '@tiptap/pm/state';

import { withinLimit } from '../utils';

export interface IMaxLengthOptions {
    getLimit: () => number | undefined;
}

/** Blocks inserts that exceed `maxLength` while still allowing deletions. */
export const MaxLength = Extension.create<IMaxLengthOptions>({
    name: 'maxLength',
    addOptions() {
        return {
            getLimit: () => undefined,
        };
    },
    addProseMirrorPlugins() {
        const { getLimit } = this.options;

        return [
            new Plugin({
                key: new PluginKey('textEditorMaxLength'),
                filterTransaction: (transaction: Transaction, state: EditorState) =>
                    withinLimit(
                        getLimit(),
                        transaction.doc.textContent.length,
                        state.doc.textContent.length
                    ),
            }),
        ];
    },
});