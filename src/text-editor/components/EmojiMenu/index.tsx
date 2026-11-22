import { useState } from 'react';

import { type Editor } from '@tiptap/core';

import { Button } from '@/button';
import { Smile } from '@/icons';
import { Popover } from '@/popover';
import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

const EMOJIS = [
    '😀',
    '😁',
    '😂',
    '🙂',
    '😉',
    '😍',
    '😎',
    '🤔',
    '👍',
    '👎',
    '👏',
    '🙏',
    '🔥',
    '✨',
    '⭐',
    '❤️',
    '✅',
    '❌',
    '⚠️',
    '📌',
    '📎',
    '📅',
    '💡',
    '🚀',
] as const;

export const EmojiMenu = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
    const labels = useAuiLabels();
    const [open, setOpen] = useState(false);

    return (
        <Popover isOpen={open} onOpenChange={setOpen}>
            <Popover.Trigger>
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    hidden
                    disabled={disabled}
                    aria-label={labels.emoji}
                    onMouseDown={event => event.preventDefault()}
                    icon={{ Component: Smile }}
                >
                    {labels.emoji}
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <div className={styles.grid} role="group" aria-label={labels.emoji}>
                    {EMOJIS.map(emoji => (
                        <Button
                            key={emoji}
                            type="button"
                            size="sm"
                            variant="secondary"
                            aria-label={emoji}
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => {
                                editor?.chain().focus().insertContent(emoji).run();
                                setOpen(false);
                            }}
                        >
                            {emoji}
                        </Button>
                    ))}
                </div>
            </Popover.Content>
        </Popover>
    );
};
