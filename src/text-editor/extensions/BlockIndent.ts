import { Extension } from '@tiptap/core';

const MAX_INDENT = 8;

const indentOf = (value: unknown) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
        return 0;
    }

    return parsed;
};

declare module '@tiptap/core' {
    // Tiptap names this augmentation `Commands`.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Commands<ReturnType> {
        blockIndent: {
            /** Increases the current paragraph or heading indent by one step. */
            indentBlock: () => ReturnType;
            /** Decreases the current paragraph or heading indent by one step. */
            outdentBlock: () => ReturnType;
        };
    }
}

/** Paragraph and heading indent, stored as `margin-left` steps of 24px. */
export const BlockIndent = Extension.create({
    name: 'blockIndent',

    addGlobalAttributes() {
        return [
            {
                types: ['paragraph', 'heading'],
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: (element: HTMLElement) => {
                            const match = /^(\d+(?:\.\d+)?)px$/.exec(element.style.marginLeft);

                            if (!match?.[1]) {
                                return 0;
                            }

                            return Math.round(Number(match[1]) / 24);
                        },
                        renderHTML: () => ({}),
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            indentBlock:
                () =>
                ({ editor, commands }) => {
                    const type = editor.isActive('heading') ? 'heading' : 'paragraph';
                    const next = Math.min(indentOf(editor.getAttributes(type).indent) + 1, MAX_INDENT);

                    return commands.updateAttributes(type, { indent: next });
                },
            outdentBlock:
                () =>
                ({ editor, commands }) => {
                    const type = editor.isActive('heading') ? 'heading' : 'paragraph';
                    const next = Math.max(indentOf(editor.getAttributes(type).indent) - 1, 0);

                    return commands.updateAttributes(type, { indent: next });
                },
        };
    },
});
