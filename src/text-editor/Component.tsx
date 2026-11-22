import { useEffect, useMemo, useRef, useState } from 'react';

import { type Editor } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import cn from 'classnames';

import { TextArea } from '@/textarea';

import { FormatBubble } from './components/FormatBubble';
import { Toolbar } from './components/Toolbar';
import { textEditorExtensions } from './extensions';
import { MaxLength } from './extensions/MaxLength';
import { readEditorHtml } from './extensions/readHtml';
import { useEditorMode } from './hooks/useEditorMode';
import { textEditorVariants } from './theme';
import { type ITextEditorProps } from './types';
import { editorContentFromValue, prepareHtmlForEditor, stripWordHtml, visibleText, withinLimit } from './utils';

import styles from './styles.module.css';

const editorDomAttributes = (options: {
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    invalid?: boolean;
    id?: string;
}): Record<string, string> => {
    const attributes: Record<string, string> = {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-invalid': options.invalid ? 'true' : 'false',
    };

    if (options.ariaLabel) {
        attributes['aria-label'] = options.ariaLabel;
    }

    if (options.ariaLabelledBy) {
        attributes['aria-labelledby'] = options.ariaLabelledBy;
    }

    if (options.ariaDescribedBy) {
        attributes['aria-describedby'] = options.ariaDescribedBy;
    }

    if (options.id) {
        attributes.id = options.id;
    }

    return attributes;
};

const setOrRemove = (element: HTMLElement, name: string, value?: string) => {
    if (value) {
        element.setAttribute(name, value);

        return;
    }

    element.removeAttribute(name);
};

export const TextEditor = ({
    ref,
    value,
    defaultValue,
    onChange,
    onBlur,
    size = 'md',
    variant = 'primary',
    block = true,
    disabled,
    invalid,
    readOnly,
    fontFamilies,
    uploadImage,
    maxLength,
    dataTestId,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...rest
}: ITextEditorProps) => {
    const isControlled = value !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
    const [fullscreen, setFullscreen] = useState(false);
    const current = isControlled ? value : uncontrolled;
    const { mode, openSource, openVisual } = useEditorMode();
    const [tick, setTick] = useState(0);
    const currentRef = useRef(current);
    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);
    const modeRef = useRef(mode);
    const maxLengthRef = useRef(maxLength);
    const initialHtml = useRef(current);

    currentRef.current = current;
    onChangeRef.current = onChange;
    onBlurRef.current = onBlur;
    modeRef.current = mode;
    maxLengthRef.current = maxLength;

    const emit = (next: string) => {
        if (next === currentRef.current) {
            return;
        }

        if (!isControlled) {
            setUncontrolled(next);
        }

        onChangeRef.current?.(next);

        if (isControlled) {
            setTick(item => item + 1);
        }
    };

    const extensions = useMemo(
        () => [...textEditorExtensions, MaxLength.configure({ getLimit: () => maxLengthRef.current })],
        []
    );

    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content: editorContentFromValue(initialHtml.current),
        editable: !disabled && !readOnly,
        editorProps: {
            attributes: editorDomAttributes({ ariaLabel, ariaLabelledBy, invalid }),
            transformPastedHTML: html => prepareHtmlForEditor(stripWordHtml(html)),
        },
        onUpdate: ({ editor: currentEditor }) => {
            if (modeRef.current !== 'visual') {
                return;
            }

            emit(readEditorHtml(currentEditor));
        },
    });

    useEffect(() => {
        if (!editor || mode !== 'visual') {
            return;
        }

        const live = readEditorHtml(editor);

        if (live === current) {
            return;
        }

        editor.commands.setContent(editorContentFromValue(current), { emitUpdate: false });
    }, [editor, mode, current, tick]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.setEditable(!disabled && !readOnly && mode === 'visual');
        editor.setOptions({
            editorProps: {
                attributes: editorDomAttributes({ ariaLabel, ariaLabelledBy, ariaDescribedBy, invalid, id }),
                handleDOMEvents: {
                    blur: () => {
                        onBlurRef.current?.();

                        return false;
                    },
                },
                transformPastedHTML: html => prepareHtmlForEditor(stripWordHtml(html)),
            },
        });

        const { dom } = editor.view;

        dom.setAttribute('role', 'textbox');
        dom.setAttribute('aria-multiline', 'true');
        dom.setAttribute('aria-invalid', invalid ? 'true' : 'false');
        setOrRemove(dom, 'aria-label', ariaLabel);
        setOrRemove(dom, 'aria-labelledby', ariaLabelledBy);
        setOrRemove(dom, 'aria-describedby', ariaDescribedBy);
        setOrRemove(dom, 'id', id);
    }, [editor, disabled, readOnly, mode, ariaLabel, ariaLabelledBy, ariaDescribedBy, invalid, id]);

    const showVisual = () => {
        openVisual();
        editor?.commands.setContent(editorContentFromValue(currentRef.current), { emitUpdate: false });
    };

    const count = editor && mode === 'visual' ? editor.state.doc.textContent.length : visibleText(current).length;

    return (
        <div
            {...rest}
            ref={ref}
            tabIndex={-1}
            className={cn(textEditorVariants({ size, variant, block }), fullscreen && styles.fullscreen, className)}
            data-test-id={dataTestId}
            data-invalid={invalid || undefined}
            data-disabled={disabled || undefined}
            data-readonly={readOnly || undefined}
            data-fullscreen={fullscreen || undefined}
        >
            <Toolbar
                editor={editor}
                editingDisabled={Boolean(disabled || readOnly || mode !== 'visual' || !editor)}
                modeDisabled={disabled}
                mode={mode}
                fontFamilies={fontFamilies}
                uploadImage={uploadImage}
                fullscreen={fullscreen}
                onToggleFullscreen={() => setFullscreen(next => !next)}
                onShowSource={openSource}
                onShowVisual={showVisual}
            />
            <div className={styles.visual} hidden={mode !== 'visual'}>
                <EditorContent editor={editor} className={styles.content} />
                {editor ? <FormatBubble editor={editor as Editor} disabled={Boolean(disabled || readOnly)} /> : null}
            </div>
            {mode === 'source' ? (
                <TextArea
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    aria-describedby={ariaDescribedBy}
                    id={id}
                    size={size}
                    block
                    disabled={disabled}
                    readOnly={readOnly}
                    invalid={invalid}
                    value={current}
                    onChange={event => {
                        const next = event.target.value;

                        if (!withinLimit(maxLength, visibleText(next).length, visibleText(currentRef.current).length)) {
                            return;
                        }

                        emit(next);
                    }}
                    onBlur={() => onBlur?.()}
                />
            ) : null}
            <p className={styles.count} aria-live="polite">
                {maxLength != null ? `${count} / ${maxLength}` : String(count)}
            </p>
        </div>
    );
};

TextEditor.displayName = 'TextEditor';
