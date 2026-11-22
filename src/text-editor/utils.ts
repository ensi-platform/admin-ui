const VOID_TAGS = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'source',
    'track',
    'wbr',
]);

/** Top-level tags the toolbar schema can edit. Everything else is a foreign block. */
const SCHEMA_TAGS = new Set([
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'ul',
    'ol',
    'li',
    'strong',
    'b',
    'em',
    'i',
    'a',
    'span',
    'img',
    'br',
    'mark',
    'u',
    's',
    'strike',
    'del',
    'code',
    'pre',
    'blockquote',
    'hr',
    'sub',
    'sup',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'td',
    'th',
    'iframe',
]);

export interface IHtmlPart {
    kind: 'schema' | 'foreign';
    html: string;
}

const hasControlChar = (value: string) => {
    for (let index = 0; index < value.length; index += 1) {
        if (value.charCodeAt(index) <= 31) {
            return true;
        }
    }

    return false;
};

/** `http(s)` or a relative path. Rejects `javascript:` and other schemes. */
export const isSafeUrl = (value: string) => {
    const url = value.trim();

    if (!url || hasControlChar(url)) {
        return false;
    }

    if (/^javascript\s*:/i.test(url)) {
        return false;
    }

    if (/^https?:\/\//i.test(url)) {
        return true;
    }

    if (/^[a-z][a-z0-9+.-]*\s*:/i.test(url)) {
        return false;
    }

    return true;
};

/** Trimmed safe URL, or `null` when the value must not be stored. */
export const normalizeUrl = (value: string) => {
    const url = value.trim();

    if (!isSafeUrl(url)) {
        return null;
    }

    return url;
};

/* eslint-disable no-restricted-syntax -- tag scan keeps quote state; early-return form hides the cases */
const findTagEnd = (source: string, start: number) => {
    let quote: '"' | "'" | null = null;

    for (let index = start; index < source.length; index += 1) {
        const char = source[index];

        if (quote) {
            if (char === quote) {
                quote = null;
            }
        } else if (char === '"' || char === "'") {
            quote = char;
        } else if (char === '>') {
            return index + 1;
        }
    }

    return source.length;
};

const findMatchingClose = (source: string, from: number, name: string) => {
    const openTag = new RegExp(`^<${name}(?![\\w:-])`, 'i');
    const closeTag = new RegExp(`^</${name}(?![\\w:-])`, 'i');
    let depth = 1;

    for (let index = from; index < source.length;) {
        const next = source.indexOf('<', index);

        if (next === -1) {
            return source.length;
        }

        if (source.startsWith('<!--', next)) {
            const commentEnd = source.indexOf('-->', next);
            index = commentEnd === -1 ? source.length : commentEnd + 3;
        } else if (closeTag.test(source.slice(next))) {
            depth -= 1;
            const end = findTagEnd(source, next);

            if (depth === 0) {
                return end;
            }

            index = end;
        } else if (openTag.test(source.slice(next))) {
            const end = findTagEnd(source, next);
            const token = source.slice(next, end);

            if (!/\/\s*>$/.test(token)) {
                depth += 1;
            }

            index = end;
        } else {
            index = findTagEnd(source, next);
        }
    }

    return source.length;
};

const readPart = (source: string, index: number): { part: IHtmlPart; next: number } => {
    if (source[index] !== '<') {
        const found = source.indexOf('<', index);
        const end = found === -1 ? source.length : found;

        return { part: { kind: 'schema', html: source.slice(index, end) }, next: end };
    }

    if (source.startsWith('<!--', index)) {
        const commentEnd = source.indexOf('-->', index);
        const end = commentEnd === -1 ? source.length : commentEnd + 3;

        return { part: { kind: 'foreign', html: source.slice(index, end) }, next: end };
    }

    const tag = /^<\/?([a-zA-Z][\w:-]*)/.exec(source.slice(index));

    if (!tag) {
        return { part: { kind: 'schema', html: source[index] ?? '' }, next: index + 1 };
    }

    const name = tag[1]?.toLowerCase() ?? '';
    const closing = source[index + 1] === '/';

    if (closing) {
        const end = findTagEnd(source, index);

        return { part: { kind: 'foreign', html: source.slice(index, end) }, next: end };
    }

    const openEnd = findTagEnd(source, index);
    const token = source.slice(index, openEnd);
    const selfClosing = VOID_TAGS.has(name) || /\/\s*>$/.test(token);

    if (selfClosing) {
        return {
            part: { kind: SCHEMA_TAGS.has(name) ? 'schema' : 'foreign', html: token },
            next: openEnd,
        };
    }

    const closeAt = findMatchingClose(source, openEnd, name);

    return {
        part: { kind: SCHEMA_TAGS.has(name) ? 'schema' : 'foreign', html: source.slice(index, closeAt) },
        next: closeAt,
    };
};

/** Splits a string into schema markup and foreign blocks, keeping the original slices. */
export const partitionHtml = (source: string): IHtmlPart[] => {
    const parts: IHtmlPart[] = [];

    for (let index = 0; index < source.length;) {
        const step = readPart(source, index);

        parts.push(step.part);
        index = step.next > index ? step.next : index + 1;
    }

    return parts;
};
/* eslint-enable no-restricted-syntax */

/** Replaces foreign blocks with an atom placeholder that stores the original slice. */
export const prepareHtmlForEditor = (source: string) =>
    partitionHtml(source)
        .map(part => {
            if (part.kind === 'schema') {
                return part.html;
            }

            return `<div data-html-block="" data-html="${encodeURIComponent(part.html)}"></div>`;
        })
        .join('');

/** Document HTML the editor can mount. Foreign slices become atom placeholders. */
export const editorContentFromValue = (value: string) => {
    const prepared = prepareHtmlForEditor(value);

    return prepared.trim() ? prepared : '<p></p>';
};

/** Visible characters, tags excluded. */
export const visibleText = (html: string) =>
    html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\u00a0/g, ' ');

/** No text, media, or foreign blocks. */
export const isEmptyDoc = (html: string) => {
    if (!html.trim()) {
        return true;
    }

    if (partitionHtml(html).some(part => part.kind === 'foreign' && part.html.trim())) {
        return false;
    }

    if (/<(img|iframe|table|hr|ul|ol|pre|blockquote)\b/i.test(html)) {
        return false;
    }

    const text = visibleText(html).trim();

    return text.length === 0;
};

/** Drops Word conditional comments, `Mso*` classes, and `mso-*` style declarations. */
export const stripWordHtml = (html: string) =>
    html
        .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '')
        .replace(/<\/?o:[^>]*>/gi, '')
        .replace(/\sclass=(["'])(?:(?!\1).)*\1/gi, match => (/\bMso/i.test(match) ? '' : match))
        .replace(/mso-[\w-]+\s*:\s*[^;"]+;?/gi, '')
        .replace(/style=(["'])\s*;+/gi, 'style=$1')
        .replace(/\sstyle=(["'])\s*\1/gi, '');

/** Further text is ignored once `maxLength` is reached. Deletions stay allowed. */
export const withinLimit = (limit: number | undefined, next: number, previous: number) => {
    if (limit == null || next <= limit) {
        return true;
    }

    return next < previous;
};
