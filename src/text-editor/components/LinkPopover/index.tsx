import { type FormEvent, useState } from 'react';

import { type Editor } from '@tiptap/core';

import { Button } from '@/button';
import { Checkbox } from '@/checkbox';
import { Link as LinkIcon } from '@/icons';
import { Input } from '@/input';
import { Popover } from '@/popover';
import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

const applyLink = (editor: Editor, href: string, blank: boolean) => {
    const attrs = {
        href,
        target: blank ? '_blank' : null,
        rel: blank ? 'noopener noreferrer' : null,
    };
    const { from, to } = editor.state.selection;

    if (from === to) {
        editor
            .chain()
            .focus()
            .insertContent(href)
            .setTextSelection({ from, to: from + href.length })
            .setLink(attrs)
            .run();

        return;
    }

    editor.chain().focus().setLink(attrs).run();
};

export const LinkPopover = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
    const labels = useAuiLabels();
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [blank, setBlank] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const href = url.trim();

        if (!href || !editor) {
            setInvalid(true);

            return;
        }

        applyLink(editor, href, blank);
        setOpen(false);
    };

    return (
        <Popover
            isOpen={open}
            onOpenChange={next => {
                setOpen(next);

                if (next) {
                    setUrl('');
                    setBlank(false);
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
                    aria-label={labels.link}
                    onMouseDown={event => event.preventDefault()}
                    aria-pressed={editor?.isActive('link') || undefined}
                    icon={{ Component: LinkIcon }}
                >
                    {labels.link}
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <form className={styles.form} onSubmit={submit}>
                    <Input
                        aria-label={labels.linkUrl}
                        size="sm"
                        value={url}
                        invalid={invalid}
                        onChange={event => {
                            setUrl(event.target.value);
                            setInvalid(false);
                        }}
                    />
                    <Checkbox size="sm" checked={blank} onChange={setBlank}>
                        {labels.linkNewWindow}
                    </Checkbox>
                    {invalid ? <p role="alert">{labels.invalidUrl}</p> : null}
                    <Button type="submit" size="sm">
                        {labels.editorApply}
                    </Button>
                </form>
            </Popover.Content>
        </Popover>
    );
};
