import { type FormEvent, useState } from 'react';

import { type Editor } from '@tiptap/core';

import { Button } from '@/button';
import { Palette } from '@/icons';
import { Input } from '@/input';
import { Popover } from '@/popover';
import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

/** Inline hexes of the neutral and status primitives. The stored HTML must not depend on `--aui-*`. */
const TEXT_COLORS = ['#1b1d22', '#5c6370', '#dc2626', '#15803d', '#a16207'] as const;
const BACKGROUND_COLORS = ['#ffffff', '#f1f5f9', '#fef2f2', '#f0fdf4', '#fefce8'] as const;
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export const ColorMenu = ({
    editor,
    disabled,
    kind,
}: {
    editor: Editor | null;
    disabled?: boolean;
    kind: 'text' | 'background';
}) => {
    const labels = useAuiLabels();
    const [open, setOpen] = useState(false);
    const [hex, setHex] = useState('');
    const [invalid, setInvalid] = useState(false);
    const swatches = kind === 'text' ? TEXT_COLORS : BACKGROUND_COLORS;
    const label = kind === 'text' ? labels.textColor : labels.bgColor;

    const apply = (color: string) => {
        if (!editor || !HEX.test(color)) {
            setInvalid(true);

            return;
        }

        if (kind === 'text') {
            editor.chain().focus().setColor(color).run();
            setOpen(false);

            return;
        }

        editor.chain().focus().setHighlight({ color }).run();
        setOpen(false);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        apply(hex.trim());
    };

    return (
        <Popover
            isOpen={open}
            onOpenChange={next => {
                setOpen(next);
                setHex('');
                setInvalid(false);
            }}
        >
            <Popover.Trigger>
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    hidden
                    disabled={disabled}
                    aria-label={label}
                    onMouseDown={event => event.preventDefault()}
                    icon={{ Component: Palette }}
                >
                    {label}
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <form className={styles.form} onSubmit={submit}>
                    <div className={styles.grid}>
                        {swatches.map(color => (
                            <button
                                key={color}
                                type="button"
                                className={styles.swatch}
                                style={{ background: color }}
                                aria-label={color}
                                onClick={() => apply(color)}
                            />
                        ))}
                    </div>
                    <Input
                        aria-label={labels.colorHex}
                        size="sm"
                        value={hex}
                        invalid={invalid}
                        onChange={event => {
                            setHex(event.target.value);
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
