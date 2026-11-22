import { type FormEvent, useState } from 'react';

import { type Editor } from '@tiptap/core';

import { Button } from '@/button';
import { Video } from '@/icons';
import { Input } from '@/input';
import { Popover } from '@/popover';
import { useAuiLabels } from '@/provider';

import styles from '../LinkPopover/styles.module.css';

export const VideoPopover = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
    const labels = useAuiLabels();
    const [open, setOpen] = useState(false);
    const [src, setSrc] = useState('');
    const [invalid, setInvalid] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const href = src.trim();

        if (!href || !editor) {
            setInvalid(true);

            return;
        }

        editor
            .chain()
            .focus()
            .insertContent({ type: 'iframe', attrs: { src: href } })
            .run();
        setOpen(false);
    };

    return (
        <Popover
            isOpen={open}
            onOpenChange={next => {
                setOpen(next);

                if (next) {
                    setSrc('');
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
                    aria-label={labels.video}
                    onMouseDown={event => event.preventDefault()}
                    icon={{ Component: Video }}
                >
                    {labels.video}
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <form className={styles.form} onSubmit={submit}>
                    <Input
                        aria-label={labels.videoUrl}
                        size="sm"
                        value={src}
                        invalid={invalid}
                        onChange={event => {
                            setSrc(event.target.value);
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
