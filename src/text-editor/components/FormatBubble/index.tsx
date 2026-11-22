import { type Editor } from '@tiptap/core';
import { BubbleMenu } from '@tiptap/react/menus';

import { Button } from '@/button';
import { Bold, Code, Italic, Strike, Subscript, Superscript, Underline } from '@/icons';
import { useAuiLabels } from '@/provider';

import { ColorMenu } from '../ColorMenu';
import { LinkPopover } from '../LinkPopover';

import styles from './styles.module.css';

const stopMouseDown = (event: { preventDefault: () => void }) => {
    event.preventDefault();
};

/** Inline commands for the current selection. Block commands stay on the toolbar. */
export const FormatBubble = ({ editor, disabled }: { editor: Editor; disabled?: boolean }) => {
    const labels = useAuiLabels();
    const run = (command: (current: Editor) => void) => {
        if (disabled) {
            return;
        }

        command(editor);
    };

    return (
        <BubbleMenu
            editor={editor}
            className={styles.root}
            data-bubble=""
            shouldShow={({ editor: current, from, to }) => !disabled && !current.state.selection.empty && from !== to}
        >
            <Button
                type="button"
                size="sm"
                variant="secondary"
                hidden
                aria-label={labels.bold}
                aria-pressed={editor.isActive('bold') || undefined}
                icon={{ Component: Bold }}
                onMouseDown={stopMouseDown}
                onClick={() => run(current => current.chain().focus().toggleBold().run())}
            >
                {labels.bold}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="secondary"
                hidden
                aria-label={labels.italic}
                aria-pressed={editor.isActive('italic') || undefined}
                icon={{ Component: Italic }}
                onMouseDown={stopMouseDown}
                onClick={() => run(current => current.chain().focus().toggleItalic().run())}
            >
                {labels.italic}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="secondary"
                hidden
                aria-label={labels.underline}
                aria-pressed={editor.isActive('underline') || undefined}
                icon={{ Component: Underline }}
                onMouseDown={stopMouseDown}
                onClick={() => run(current => current.chain().focus().toggleUnderline().run())}
            >
                {labels.underline}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="secondary"
                hidden
                aria-label={labels.strike}
                aria-pressed={editor.isActive('strike') || undefined}
                icon={{ Component: Strike }}
                onMouseDown={stopMouseDown}
                onClick={() => run(current => current.chain().focus().toggleStrike().run())}
            >
                {labels.strike}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="secondary"
                hidden
                aria-label={labels.inlineCode}
                aria-pressed={editor.isActive('code') || undefined}
                icon={{ Component: Code }}
                onMouseDown={stopMouseDown}
                onClick={() => run(current => current.chain().focus().toggleCode().run())}
            >
                {labels.inlineCode}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="secondary"
                hidden
                aria-label={labels.subscript}
                aria-pressed={editor.isActive('subscript') || undefined}
                icon={{ Component: Subscript }}
                onMouseDown={stopMouseDown}
                onClick={() => run(current => current.chain().focus().toggleSubscript().run())}
            >
                {labels.subscript}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="secondary"
                hidden
                aria-label={labels.superscript}
                aria-pressed={editor.isActive('superscript') || undefined}
                icon={{ Component: Superscript }}
                onMouseDown={stopMouseDown}
                onClick={() => run(current => current.chain().focus().toggleSuperscript().run())}
            >
                {labels.superscript}
            </Button>
            <LinkPopover editor={editor} disabled={disabled} />
            <ColorMenu editor={editor} disabled={disabled} kind="text" />
        </BubbleMenu>
    );
};
