import { type FormEvent, useState } from 'react';

import { type Editor } from '@tiptap/core';

import { Button } from '@/button';
import { Anchor as AnchorIcon } from '@/icons';
import { Input } from '@/input';
import { Popover } from '@/popover';
import { useAuiLabels } from '@/provider';

import styles from '../LinkPopover/styles.module.css';

const ANCHOR_ID = /^[A-Za-z][\w:.-]*$/;

export const AnchorPopover = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
    const labels = useAuiLabels();
    const [open, setOpen] = useState(false);
    const [anchorId, setAnchorId] = useState('');
    const [invalid, setInvalid] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const id = anchorId.trim();

        if (!editor || !ANCHOR_ID.test(id)) {
            setInvalid(true);

            return;
        }

        const type = editor.isActive('heading') ? 'heading' : 'paragraph';

        editor.chain().focus().updateAttributes(type, { id }).run();
        setOpen(false);
    };

    return (
        <Popover
            isOpen={open}
            onOpenChange={next => {
                setOpen(next);

                if (next) {
                    setAnchorId('');
                    setInvalid(false);
                }
            }}
        >
            <Popover.Trigger>
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    hidden
                    disabled={disabled}
                    aria-label={labels.anchor}
                    onMouseDown={event => event.preventDefault()}
                    icon={{ Component: AnchorIcon }}
                >
                    {labels.anchor}
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <form className={styles.form} onSubmit={submit}>
                    <Input
                        aria-label={labels.anchorId}
                        size="sm"
                        value={anchorId}
                        invalid={invalid}
                        onChange={event => {
                            setAnchorId(event.target.value);
                            setInvalid(false);
                        }}
                    />
                    {invalid ? <p role="alert">{labels.invalidUrl}</p> : null}
                    <Button type="submit" size="sm">
                        {labels.editorApply}
                    </Button>
                </form>
            </Popover.Content>
        </Popover>
    );
};
