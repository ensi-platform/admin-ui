import { type FormEvent, useState } from 'react';

import { type Editor } from '@tiptap/core';

import { Button } from '@/button';
import { Image as ImageIcon } from '@/icons';
import { Input } from '@/input';
import { Popover } from '@/popover';
import { useAuiLabels } from '@/provider';

import { normalizeUrl } from '../../utils';

import styles from '../LinkPopover/styles.module.css';

const WIDTHS = ['25%', '50%', '100%'] as const;

export const ImagePopover = ({
    editor,
    disabled,
    uploadImage,
}: {
    editor: Editor | null;
    disabled?: boolean;
    uploadImage?: (file: File) => Promise<string>;
}) => {
    const labels = useAuiLabels();
    const [open, setOpen] = useState(false);
    const [src, setSrc] = useState('');
    const [alt, setAlt] = useState('');
    const [width, setWidth] = useState<(typeof WIDTHS)[number] | null>(null);
    const [invalid, setInvalid] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const href = normalizeUrl(src);

        if (!href || !editor) {
            setInvalid(true);

            return;
        }

        const chain = editor
            .chain()
            .focus()
            .setImage({ src: href, alt: alt.trim() || undefined });

        if (width) {
            chain.updateAttributes('image', { width });
        }

        chain.run();
        setOpen(false);
    };

    return (
        <Popover
            isOpen={open}
            onOpenChange={next => {
                setOpen(next);

                if (next) {
                    setSrc('');
                    setAlt('');
                    setWidth(null);
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
                    aria-label={labels.image}
                    onMouseDown={event => event.preventDefault()}
                    icon={{ Component: ImageIcon }}
                >
                    {labels.image}
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <form className={styles.form} onSubmit={submit}>
                    <Input
                        aria-label={labels.imageUrl}
                        size="sm"
                        value={src}
                        invalid={invalid}
                        onChange={event => {
                            setSrc(event.target.value);
                            setInvalid(false);
                        }}
                    />
                    <Input
                        aria-label={labels.imageAlt}
                        size="sm"
                        value={alt}
                        onChange={event => setAlt(event.target.value)}
                    />
                    <div role="group" aria-label={labels.imageWidth}>
                        {WIDTHS.map(item => (
                            <Button
                                key={item}
                                type="button"
                                size="sm"
                                variant="secondary"
                                aria-pressed={width === item || undefined}
                                onClick={() => setWidth(item)}
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                    {uploadImage ? (
                        <input
                            aria-label={labels.imageFile}
                            type="file"
                            accept="image/*"
                            onChange={event => {
                                const file = event.target.files?.[0];

                                if (!file) {
                                    return;
                                }

                                uploadImage(file)
                                    .then(url => {
                                        setSrc(url);
                                        setInvalid(false);
                                    })
                                    .catch(() => setInvalid(true));
                            }}
                        />
                    ) : null}
                    {invalid ? <p role="alert">{labels.invalidUrl}</p> : null}
                    <Button type="submit" size="sm">
                        {labels.editorApply}
                    </Button>
                </form>
            </Popover.Content>
        </Popover>
    );
};
