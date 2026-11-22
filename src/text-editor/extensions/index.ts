import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-text-style/font-family';
import { FontSize } from '@tiptap/extension-text-style/font-size';
import { LineHeight } from '@tiptap/extension-text-style/line-height';
import { StarterKit } from '@tiptap/starter-kit';

import { BlockIndent } from './BlockIndent';
import { GlobalAttributes } from './GlobalAttributes';
import { HtmlBlock } from './HtmlBlock';
import { Iframe } from './Iframe';
import { QuietTextAlign } from './QuietTextAlign';

/** Built-in font menu. A `fontFamilies` prop replaces this list. */
export const DEFAULT_FONT_FAMILIES = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'monospace'] as const;

export const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px'] as const;

export const LINE_HEIGHTS = ['1', '1.5', '2'] as const;

export const textEditorExtensions = [
    StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
        trailingNode: false,
    }),
    GlobalAttributes,
    QuietTextAlign,
    BlockIndent,
    Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: false,
        HTMLAttributes: {},
        isAllowedUri: () => true,
    }),
    Image.configure({
        allowBase64: false,
        resize: false,
    }),
    TextStyle,
    FontFamily,
    FontSize,
    LineHeight,
    Color,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Iframe,
    HtmlBlock,
];
