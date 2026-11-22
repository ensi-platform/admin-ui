import { type ComponentProps, type MouseEvent, type ReactNode } from 'react';

import { type Editor } from '@tiptap/core';

import { Button } from '@/button';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Clear,
    Code,
    HorizontalRule,
    Indent,
    Italic,
    List,
    ListChecks,
    ListOrdered,
    Maximize,
    Outdent,
    Quote,
    Redo,
    Strike,
    Subscript,
    Superscript,
    Table,
    Underline,
    Undo,
} from '@/icons';
import { useAuiLabels } from '@/provider';

import { DEFAULT_FONT_FAMILIES, FONT_SIZES, LINE_HEIGHTS } from '../../extensions';
import { type TTextEditorMode } from '../../hooks/useEditorMode';
import { AnchorPopover } from '../AnchorPopover';
import { ChoiceMenu } from '../ChoiceMenu';
import { ColorMenu } from '../ColorMenu';
import { EmojiMenu } from '../EmojiMenu';
import { ImagePopover } from '../ImagePopover';
import { LinkPopover } from '../LinkPopover';
import { VideoPopover } from '../VideoPopover';

import styles from './styles.module.css';

const headingLevel = (template: string, level: number) => template.replace('{level}', String(level));

/** Keeps the editor selection when the pointer goes to a toolbar control. */
const ToolButton = ({ onMouseDown, ...props }: ComponentProps<typeof Button>) => (
    <Button
        type="button"
        size="sm"
        variant="secondary"
        {...props}
        onMouseDown={(event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            onMouseDown?.(event);
        }}
    />
);

const Group = ({ children }: { children: ReactNode }) => <div className={styles.group}>{children}</div>;

export const Toolbar = ({
    editor,
    editingDisabled,
    modeDisabled,
    mode,
    fontFamilies = DEFAULT_FONT_FAMILIES,
    uploadImage,
    fullscreen,
    onToggleFullscreen,
    onShowSource,
    onShowVisual,
}: {
    editor: Editor | null;
    /** Marks, lists, link, image, and color cannot run. */
    editingDisabled?: boolean;
    /** The field is disabled, so the mode toggle is off too. */
    modeDisabled?: boolean;
    mode: TTextEditorMode;
    fontFamilies?: readonly string[];
    uploadImage?: (file: File) => Promise<string>;
    fullscreen?: boolean;
    onToggleFullscreen: () => void;
    onShowSource: () => void;
    onShowVisual: () => void;
}) => {
    const labels = useAuiLabels();
    const editing = Boolean(editingDisabled);
    const run = (command: (current: Editor) => void) => {
        if (!editor || editing) {
            return;
        }

        command(editor);
    };
    const activeHeading = ([1, 2, 3, 4] as const).find(level => editor?.isActive('heading', { level }));
    const headingLabel = activeHeading ? headingLevel(labels.heading, activeHeading) : labels.paragraph;
    const inList = Boolean(editor?.isActive('listItem'));
    const clearFormatting = () =>
        run(current => {
            // prettier keeps the chain on one line; the newline rule wants a break.
            // eslint-disable-next-line newline-per-chained-call
            current.chain().focus().unsetAllMarks().clearNodes().run();
        });
    const indent = () =>
        run(current => {
            if (inList) {
                current.chain().focus().sinkListItem('listItem').run();

                return;
            }

            current.chain().focus().indentBlock().run();
        });
    const outdent = () =>
        run(current => {
            if (inList) {
                current.chain().focus().liftListItem('listItem').run();

                return;
            }

            current.chain().focus().outdentBlock().run();
        });
    const insertTable = () =>
        run(current => {
            current.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        });

    return (
        <div className={styles.root} role="toolbar" aria-label={labels.editorVisual}>
            <Group>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.undo}
                    icon={{ Component: Undo }}
                    onClick={() => run(current => current.chain().focus().undo().run())}
                >
                    {labels.undo}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.redo}
                    icon={{ Component: Redo }}
                    onClick={() => run(current => current.chain().focus().redo().run())}
                >
                    {labels.redo}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.clearFormat}
                    icon={{ Component: Clear }}
                    onClick={clearFormatting}
                >
                    {labels.clearFormat}
                </ToolButton>
            </Group>
            <Group>
                <ChoiceMenu
                    label={headingLabel}
                    disabled={editing || !editor}
                    pressed={Boolean(activeHeading)}
                    options={[
                        {
                            id: 'p',
                            label: labels.paragraph,
                            active: !activeHeading,
                            onSelect: () => run(current => current.chain().focus().setParagraph().run()),
                        },
                        ...([1, 2, 3, 4] as const).map(level => ({
                            id: `h${level}`,
                            label: headingLevel(labels.heading, level),
                            active: activeHeading === level,
                            onSelect: () => run(current => current.chain().focus().toggleHeading({ level }).run()),
                        })),
                    ]}
                />
                <ChoiceMenu
                    label={labels.fontFamily}
                    disabled={editing || !editor}
                    options={fontFamilies.map(family => ({
                        id: family,
                        label: family,
                        active: editor?.isActive('textStyle', { fontFamily: family }),
                        onSelect: () => run(current => current.chain().focus().setFontFamily(family).run()),
                    }))}
                />
                <ChoiceMenu
                    label={labels.fontSize}
                    disabled={editing || !editor}
                    options={FONT_SIZES.map(size => ({
                        id: size,
                        label: size.replace('px', ''),
                        active: editor?.isActive('textStyle', { fontSize: size }),
                        onSelect: () => run(current => current.chain().focus().setFontSize(size).run()),
                    }))}
                />
                <ChoiceMenu
                    label={labels.lineHeight}
                    disabled={editing || !editor}
                    options={LINE_HEIGHTS.map(height => ({
                        id: height,
                        label: height,
                        active: editor?.isActive('textStyle', { lineHeight: height }),
                        onSelect: () => run(current => current.chain().focus().setLineHeight(height).run()),
                    }))}
                />
            </Group>
            <Group>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.bold}
                    aria-pressed={editor?.isActive('bold') || undefined}
                    icon={{ Component: Bold }}
                    onClick={() => run(current => current.chain().focus().toggleBold().run())}
                >
                    {labels.bold}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.italic}
                    aria-pressed={editor?.isActive('italic') || undefined}
                    icon={{ Component: Italic }}
                    onClick={() => run(current => current.chain().focus().toggleItalic().run())}
                >
                    {labels.italic}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.underline}
                    aria-pressed={editor?.isActive('underline') || undefined}
                    icon={{ Component: Underline }}
                    onClick={() => run(current => current.chain().focus().toggleUnderline().run())}
                >
                    {labels.underline}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.strike}
                    aria-pressed={editor?.isActive('strike') || undefined}
                    icon={{ Component: Strike }}
                    onClick={() => run(current => current.chain().focus().toggleStrike().run())}
                >
                    {labels.strike}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.inlineCode}
                    aria-pressed={editor?.isActive('code') || undefined}
                    icon={{ Component: Code }}
                    onClick={() => run(current => current.chain().focus().toggleCode().run())}
                >
                    {labels.inlineCode}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.subscript}
                    aria-pressed={editor?.isActive('subscript') || undefined}
                    icon={{ Component: Subscript }}
                    onClick={() => run(current => current.chain().focus().toggleSubscript().run())}
                >
                    {labels.subscript}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.superscript}
                    aria-pressed={editor?.isActive('superscript') || undefined}
                    icon={{ Component: Superscript }}
                    onClick={() => run(current => current.chain().focus().toggleSuperscript().run())}
                >
                    {labels.superscript}
                </ToolButton>
            </Group>
            <Group>
                <ColorMenu editor={editor} disabled={editing} kind="text" />
                <ColorMenu editor={editor} disabled={editing} kind="background" />
            </Group>
            <Group>
                {(
                    [
                        ['left', labels.alignLeft, AlignLeft],
                        ['center', labels.alignCenter, AlignCenter],
                        ['right', labels.alignRight, AlignRight],
                        ['justify', labels.alignJustify, AlignJustify],
                    ] as const
                ).map(([align, label, Icon]) => (
                    <ToolButton
                        key={align}
                        hidden
                        disabled={editing || !editor}
                        aria-label={label}
                        aria-pressed={editor?.isActive({ textAlign: align }) || undefined}
                        icon={{ Component: Icon }}
                        onClick={() => run(current => current.chain().focus().setTextAlign(align).run())}
                    >
                        {label}
                    </ToolButton>
                ))}
            </Group>
            <Group>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.bulletList}
                    aria-pressed={editor?.isActive('bulletList') || undefined}
                    icon={{ Component: List }}
                    onClick={() => run(current => current.chain().focus().toggleBulletList().run())}
                >
                    {labels.bulletList}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.orderedList}
                    aria-pressed={editor?.isActive('orderedList') || undefined}
                    icon={{ Component: ListOrdered }}
                    onClick={() => run(current => current.chain().focus().toggleOrderedList().run())}
                >
                    {labels.orderedList}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.taskList}
                    aria-pressed={editor?.isActive('taskList') || undefined}
                    icon={{ Component: ListChecks }}
                    onClick={() => run(current => current.chain().focus().toggleTaskList().run())}
                >
                    {labels.taskList}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.indent}
                    icon={{ Component: Indent }}
                    onClick={indent}
                >
                    {labels.indent}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.outdent}
                    icon={{ Component: Outdent }}
                    onClick={outdent}
                >
                    {labels.outdent}
                </ToolButton>
            </Group>
            <Group>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.blockquote}
                    aria-pressed={editor?.isActive('blockquote') || undefined}
                    icon={{ Component: Quote }}
                    onClick={() => run(current => current.chain().focus().toggleBlockquote().run())}
                >
                    {labels.blockquote}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.codeBlock}
                    aria-pressed={editor?.isActive('codeBlock') || undefined}
                    icon={{ Component: Code }}
                    onClick={() => run(current => current.chain().focus().toggleCodeBlock().run())}
                >
                    {labels.codeBlock}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.horizontalRule}
                    icon={{ Component: HorizontalRule }}
                    onClick={() => run(current => current.chain().focus().setHorizontalRule().run())}
                >
                    {labels.horizontalRule}
                </ToolButton>
            </Group>
            <Group>
                <LinkPopover editor={editor} disabled={editing} />
                <AnchorPopover editor={editor} disabled={editing} />
                <ImagePopover editor={editor} disabled={editing} uploadImage={uploadImage} />
                <VideoPopover editor={editor} disabled={editing} />
                <EmojiMenu editor={editor} disabled={editing} />
                <ToolButton
                    hidden
                    disabled={editing || !editor}
                    aria-label={labels.table}
                    aria-pressed={editor?.isActive('table') || undefined}
                    icon={{ Component: Table }}
                    onClick={insertTable}
                >
                    {labels.table}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor?.isActive('table')}
                    aria-label={labels.tableRow}
                    onClick={() => run(current => current.chain().focus().addRowAfter().run())}
                >
                    {labels.tableRow}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor?.isActive('table')}
                    aria-label={labels.tableColumn}
                    onClick={() => run(current => current.chain().focus().addColumnAfter().run())}
                >
                    {labels.tableColumn}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor?.isActive('table')}
                    aria-label={labels.tableHeader}
                    onClick={() => run(current => current.chain().focus().toggleHeaderRow().run())}
                >
                    {labels.tableHeader}
                </ToolButton>
                <ToolButton
                    hidden
                    disabled={editing || !editor?.isActive('table')}
                    aria-label={labels.tableDelete}
                    onClick={() => run(current => current.chain().focus().deleteTable().run())}
                >
                    {labels.tableDelete}
                </ToolButton>
            </Group>
            <Group>
                {mode === 'visual' ? (
                    <ToolButton
                        hidden
                        disabled={modeDisabled}
                        aria-label={labels.editorSource}
                        icon={{ Component: Code }}
                        onClick={onShowSource}
                    >
                        {labels.editorSource}
                    </ToolButton>
                ) : (
                    <ToolButton disabled={modeDisabled} aria-label={labels.editorVisual} onClick={onShowVisual}>
                        {labels.editorVisual}
                    </ToolButton>
                )}
                <ToolButton
                    hidden
                    disabled={modeDisabled}
                    aria-label={fullscreen ? labels.fullscreenExit : labels.fullscreen}
                    aria-pressed={fullscreen || undefined}
                    icon={{ Component: Maximize }}
                    onClick={onToggleFullscreen}
                >
                    {fullscreen ? labels.fullscreenExit : labels.fullscreen}
                </ToolButton>
            </Group>
        </div>
    );
};
